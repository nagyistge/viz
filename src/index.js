/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

require('./styles/colors.css');

import FocusedCBGSliceHTMLLabels from './components/trends/cbg/FocusedCBGSliceHTMLLabels';
import FocusedCBGSliceTime from './components/trends/cbg/FocusedCBGSliceTime';
import FocusedSMBGPointLabel from './components/trends/smbg/FocusedSMBGPointLabel';
import FocusedSMBGRangeLabels from './components/trends/smbg/FocusedSMBGRangeLabels';
import RangeSelect from './components/trends/cbg/RangeSelect';

import TwoOptionToggle from './components/common/controls/TwoOptionToggle';

import PumpSettingsContainer from './containers/settings/PumpSettingsContainer';
import TrendsContainer from './containers/trends/TrendsContainer';

import vizReducer from './redux/reducers/';

const components = {
  FocusedCBGSliceHTMLLabels,
  FocusedCBGSliceTime,
  FocusedSMBGPointLabel,
  FocusedSMBGRangeLabels,
  RangeSelect,
  TwoOptionToggle,
};

const containers = {
  PumpSettingsContainer,
  TrendsContainer,
};

export { components, containers, vizReducer };
