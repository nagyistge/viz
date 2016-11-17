## Overview of features

As of mid-November, 2016, Tidepool's main web application for PwD's and their care teams to view and contextualize the PwD's diabetes data & notes has five data views:

- Basics
- Daily
- Weekly
- Trends
- Device Settings

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

Because of this large amount of share state @jebeck has come to think about the data visualization in blip not as five separate views but as a single "meta" visualization that can manifest in five different ways, one at a time (although it's not that great of a leap to imagine a mega dashboard composed of all five views at once, with all views updating as/if necessary when the user navigates along the datetime dimension).

### Notes on the five views

#### Basics

The Basics view is the newest of the five views, and it was developed quite quickly in the summer and autumn of 2015. The Basics largely consists of some summary statistics in the left column and in the right column a set of calendar-like grids with Monday through Sunday rows showing the last two full weeks plus the current week in progress (up to three weeks total). There is a calendar section for each of: fingerstick blood glucose readings, boluses, infusion site changes, and basal events with some filters available for all but infusion site changes. The intent of the Basics view as a whole is to give a user (but especially a clinician user) a quick at-a-glance view of the "basics" of a PwD's diabetes therapy. Is the PwD checking their blood glucose? Is he or she delivering boluses? Is he or she changing his or her infusion site at an acceptable frequency? Does he or she use temp basals? Double-clicking on any day in one of the calendar sections takes the user to the Daily view for that day so that they can inspect dive into the details of an unusual-looking day.


In order to release the Basics quickly, we left out navigation along the datetime dimension. In general the data "munging" strategy that drives the display is **not** an example of how we want to handle data munging for a new view. The strategy taken with the Basics is to find the 

[^a]: @jebeck is about 90% confident that [this location in the TidelineData constructor](https://github.com/tidepool-org/tideline/blob/master/js/tidelinedata.js#L61 'GitHub: tideline js/tidelinedata.js') is the ultimate source of the hard-coding for the current blood glucose target range.
[^b]: Display timezone can also currently be configured via query parameter (again, as long as "Remember Me" is used on login)—e.g., `?timezone=Europe-Paris`. The `/` found in most [IANA](https://www.iana.org/time-zones 'IANA Time Zone Database') timezones must be replaced with `-` in the query parameter value: `US-Pacific` instead of `US/Pacific`.
