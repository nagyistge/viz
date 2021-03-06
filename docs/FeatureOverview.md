## Overview of features

As of mid-November, 2016, Tidepool's main web application for PwD's and their care teams to view and contextualize the PwD's diabetes data & notes has five data views:

- Basics
- Daily
- Weekly
- Trends
- Device Settings

#### Table of contents

- [Shared state](#shared-state)
- [Notes on the five views](#notes-on-the-five-views)
  - [Basics](#basics)
  - [Daily](#daily)
  - [Weekly](#weekly)
  - [Trends](#trends)
  - [Device Settings](#device-settings)
- [Data preprocessing](#data-preprocessing)
- [Navigation](#navigation)

### Shared state

These views *share* some common state, including:

- a PwD's data: diabetes device data & notes
- blood glucose units for display (mg/dL or mmol/L)
- blood glucose target range
- timezone for display
- current datetime location

Three of these are not yet user-configurable, although we plan to surface them soon in a user display preferences page and then persist them to Tidepool's servers as part of the data stored for each user. These are:

- blood glucose units = mg/dL but can be switched to mmol/L with `?units=mmoll` in a query parameter (as long as "Remember Me" is used on login)
- blood glucose target range[^a]:
    + very low: < 60 mg/dL
    + low: >= 60 mg/dL and < 80 mg/dL
    + target: >= 80 mg/dL and < 180 mg/dL
    + high: >= 180 mg/dL and < 300 mg/dL
    + very high: >= 300 mg/dL
- timezone for display = defaulted to timezone from most recent [upload metadata](http://developer.tidepool.io/data-model/device-data/types/upload.html 'Tidepool data model docs: upload') object in the PwD's data; this defaulting happens in [blip's processPatientData utility function](https://github.com/tidepool-org/blip/blob/master/app/core/utils.js#L224 'GitHub: blip app/core/utils.js')[^b], which is called from [`<PatientData/>`](https://github.com/tidepool-org/blip/blob/master/app/pages/patientdata/patientdata.js#L578 'GitHub: blip app/pages/patientdata/patientdata.js')

Aside from these three things, the remaining state—the current PwD's data and the current datetime location—is all ephemeral, relevant only to the current *patient data viewing session*.

Because of this large amount of shared state @jebeck has come to think about the data visualization in blip not as five separate views but as a single "meta" visualization that can manifest in five different ways, one at a time (although it's not that great of a leap to imagine a mega dashboard composed of all five views at once, with all views updating as/if necessary when the user navigates along the datetime dimension).

### Notes on the five views

#### Basics

The Basics view is the newest of the five views, and it was developed quite quickly in the summer and autumn of 2015. The Basics largely consists of some summary statistics in the left column and in the right column a set of calendar-like grids with Monday through Sunday rows showing the last two full weeks plus the current week in progress (up to three weeks total). There is a calendar section for each of: fingerstick blood glucose readings, boluses, infusion site changes, and basal events with some filters available for all but infusion site changes. The intent of the Basics view as a whole is to give a user (but especially a clinician user) a quick at-a-glance view of the "basics" of a PwD's diabetes therapy. Is the PwD checking their blood glucose? Is he or she delivering boluses? Is he or she changing his or her infusion site at an acceptable frequency? Does he or she use temp basals? Double-clicking on any day in one of the calendar sections takes the user to the Daily view for that day so that they can dive into the details of any particular day.

In order to release the Basics quickly, we left out navigation along the datetime dimension. In general the data "munging" strategy that drives the display is **not** an example of how we want to handle data munging for a new view. The strategy taken with the Basics is to find the subset of the data that represents the most recent two full weeks plus the current week in progress and "munge" this data in all the required ways (counting fingersticks and boluses per day, etc.), then simply store a data structure containing the results of this munging in state and pass it to the Basics React components for rendering. In short, the data processing for the Basics view is entirely static and separated from the rendering components *too much* because it is separated out as a prerequisite step before rendering begins. This has the consequence that there is no easy road for making the data munging more dynamic to add navigation along the datetime dimension.

#### Daily

The Daily view shows one day of a PwD's diabetes device data at a time, and the user can navigate along the datetime dimension by clicking and dragging to pan in small increments, by clicking and dragging the scroll thumb in the scroll bar, and by using the left, right, and "skip to most recent" buttons in the visualization navigation sub-header.

The Daily view is optimized for viewing insulin pump data without or without CGM data. It is divided into four "pools" showing, from top to bottom, (1) icons representing device time changes & notes that the user can click to open in a modal, (2) fingerstick and CGM data, (3) bolus and carb data (the latter only available via bolus calculator data), and (4) basal insulin data. When the user navigates along the datetime dimension, all pools move in sync.

More detail about each datum displayed in the daily view is available through hover interactions that produce tooltips displaying various amounts of information.

[💣 tech debt 💣] The performance of the scrolling on the daily view leaves much to be desired. @jebeck has spent time in the past experimenting with [different](http://bl.ocks.org/jebeck/1974647d476b67a0439d 'tideline-style scrolling') [techniques](http://bl.ocks.org/jebeck/5ffdaad2094499997a21 'zipline-style scrolling') to improve the rendering performance, but none are compatible with the architecture of the view in tideline, which is rather tied to the particular method of timeline rendering that was chosen. If the Daily view is reimplemented more-or-less as-is in this repository, two (not necessarily mutually exclusive) techniques should be considered:

- the "virtual" rendering strategy employed in [@jebeck's zipline experiment](https://github.com/jebeck/zipline) (see also [her slides from a D3 meetup talk about this](http://janabeck.com/d3-meetup-talk/#/ 'tideline and zipline slides'))
- using HTML5's `<canvas>` instead of SVG for all or part of the rendering

#### Weekly

The Weekly view shows two weeks of a PwD's fingerstick blood glucose readings at a time in a vertically-scrollable display of stacked days in reverse chronological order (most recent the top). Three "widgets" below the stacked days display summary statistics about the two weeks in view assuming the insulin pump or blood glucose data are sufficient to calculate them: the basal to bolus ratio, time in target range, and average (mean) blood glucose for the two weeks. As the user navigates the datetime dimension (using the same mechanisms as available for the Daily view, only the panning and scrolling are vertical instead of horizontal), these widgets update to reflect the newly selected time period.

[💣 tech debt 💣] The scrolling—i.e., essentially the same as for the Daily view.

#### Trends

There are two versions of the Trends view, one for displaying trend information based on fingerstick blood glucose data and the other for displaying trend information based on CGM data. The BGM version was developed first, and the CGM version is a recent addition. A 14-day span of data is the default for this view, although the user can toggle to 7 days or 28 days using selectors displayed in the upper left corner of the display. (In the upper right of the display, the user can toggle days of the week such as Monday, Tuesday, etc. or weekdays vs. weekends off and on.) Both the CGM and CGM versions group all data in the selected span of time by time of day in an effort to show how blood glucose varies for the PwD by time of day. On the BGM version where the data is quite sparse, the data is grouped into three-hour "bins," and on the CGM version thirty-minute bins are used.

Like on the Daily view, hovering over various items in the display will produce a tooltip with more information. As of mid-November, 2016, we are getting ready to release the reimplemented BGM version of the Trends views alongside the new CGM version with new hover tooltips that were developed with the idea that this tooltip component be used for *all* the views as they are reimplemented in this repository.

Currently only the data visualization itself for the BGM and CGM versions of the Trends view are implemented in this repository: code in blip is still being used for the 7, 14, and 28 days domain size selectors, the day of the week selectors, and of course the visualization sub-header that provides navigation between the views and along the datetime dimension. This makes the interface(s) between the blip and viz code a bit messier than they should be.

[💣 tech debt 💣] For example, because of where they need to be rendered in the component hierarchy, the hover tooltip component(s) are currently being rendered in blip, and so as an expedient way to share the hover state between the viz code and the blip code, we are using Redux actions to represent the hover focus on element(s). Since hover state is **not** the kind of state that it makes sense to persist when a user navigates away from the visualization part of the app before coming back, the Redux store is not the appropriate place to store this state. Rather, this state should probably be contained in the React component state of a high-level container component in Trends.

#### Device Settings

The device settings view is the simplest, showing just a relatively simple tabular display of (a subset of) the PwD's insulin pump settings, including basal schedules and bolus calculator settings such as the user's programmed insulin sensitivity factor(s) and insulin-to-carb ratio(s).

Because Tandem pumps require a quite different visual representation (as well as a different structure to the data model) to capture the way the settings are programmed, the release of support for Tandem pumps was our forcing function for writing new code to display the Tandem settings, and so we also reimplemented the device settings display for all other Tidepool-supported pumps.

A new feature added as part of the reimplementation is the preservation of open or collapsed basal schedules (or Tandem "timed profiles") even when the user navigates away from Device Settings to elsewhere in the app before coming back. Leveraging blip's Redux store to manage the state of each collapsible section made this feature-add quite easy. (See [@tidepool/viz's usage of Redux](./Redux.md) for more information on managing visualization state through blip's redux store.)

[💣 tech debt 💣] Only the most recent insulin pump settings are displayed, and a blip user cannot navigate along the datetime dimension at all to view older insulin pump settings.

### Data preprocessing

While [the Tidepool diabetes device data model(s)](http://developer.tidepool.io/data-model/ 'Tidepool developer portal: data model documentation') were developed with client applications in mind, there are still advantages—mainly for performance—to preprocessing the raw data returned to the client application before passing it on to the rendering code.

Some background on tideline's data preprocessing and its problems are documented in [viz data preprocessing notes](https://docs.google.com/document/d/190mj_S9vYKvINPbU7cMajGekebyX6AJ-W6v3P-cCRWI/edit# 'Google doc: viz data preprocessing notes').

We plan to replace tideline's data preprocessing, as well as the data filtering that happens during [navigation](#navigation), with a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers 'MDN: Using Web Workers') that performs these tasks. In fact, we [started implementation](https://github.com/tidepool-org/viz/tree/save/web-worker-1-basic-data-processing 'GitHub: viz branch save/web-worker-1-basic-data-processing') in the fall of 2016 but then set it aside (temporarily) to focus on higher priorities. You may want to read [some additional discussion and planning notes](https://docs.google.com/document/d/14n4OyyTKKfBxz7DzX9DnKST3nVarfae7Fgl9HgG6BlY/edit 'Google doc: blip & viz data flow') and especially [the documentation for the beginnings of the Web Worker implementation](https://github.com/tidepool-org/viz/blob/save/web-worker-1-basic-data-processing/src/worker/README.md 'GitHub: viz src/worker/README.md').

### Navigation

Blip currently renders [the component](https://github.com/tidepool-org/blip/blob/master/app/components/chart/header.js 'GitHub: blip app/components/chart/header.js') that provides navigation across the five data visualization views and along the datetime dimension.

[💣 tech debt 💣] This navigation is not a common container for each of the views, but rather the `<PatientData/>` component renders a navigation `<Header/>` alongside each view. This has the result that each of the views reimplements and repeats very similar (and probably sometimes identical) logic for navigating between the views and along the datetime dimension. Especially tricky (and ripe for DRYing out) is the code for refiltering the data to restrict it to the updated datetime domain when the user is navigating along the datetime dimension.

* * * * *

[^a]: @jebeck is about 90% confident that [this location in the TidelineData constructor](https://github.com/tidepool-org/tideline/blob/master/js/tidelinedata.js#L61 'GitHub: tideline js/tidelinedata.js') is the ultimate source of the hard-coding for the current blood glucose target range.
[^b]: Display timezone can also currently be configured via query parameter (again, as long as "Remember Me" is used on login)—e.g., `?timezone=Europe-Paris`. The `/` found in most [IANA](https://www.iana.org/time-zones 'IANA Time Zone Database') timezones must be replaced with `-` in the query parameter value: `US-Pacific` instead of `US/Pacific`.
