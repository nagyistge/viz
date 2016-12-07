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

import React, { PropTypes } from 'react';

import Tooltip from '../../common/tooltips/Tooltip';

import { MGDL_UNITS, MMOLL_UNITS } from '../../../utils/constants';
import { displayBgValue } from '../../../utils/format';

import styles from './FocusedRangeLabels.css';

const FocusedRangeLabels = (props) => {
  const { focusedKeys, focusedRange, focusedSlice } = props;
  if (!(focusedRange || (focusedKeys && focusedSlice))) {
    return null;
  }
  // no range labels when focus is the median only on cbg version
  if (focusedKeys && focusedKeys.length === 1) {
    return null;
  }

  const { bgUnits, dataType } = props;
  const isCbg = dataType === 'cbg';
  const dataBucket = isCbg ? 'focusedSlice' : 'focusedRange';
  const { [dataBucket]: { data, position } } = props;
  const top = isCbg ? focusedKeys[1] : 'max';
  const center = isCbg ? 'median' : 'mean';
  const bottom = isCbg ? focusedKeys[0] : 'min';
  const topPosition = {
    top: position.yPositions[top],
    left: position.left,
  };
  const bottomPosition = {
    top: position.yPositions[bottom],
    left: position.left,
  };
  const centerPosition = {
    top: position.yPositions[center],
    left: position.left,
  };
  const centerSide = position.tooltipLeft ? 'left' : 'right';
  return (
    <div className={styles.container}>
      <Tooltip
        content={<span className={styles.number}>{displayBgValue(data[top], bgUnits)}</span>}
        backgroundColor={'transparent'}
        borderColor={'transparent'}
        position={topPosition}
        side={'top'}
        tail={false}
      />
      <Tooltip
        content={
          <span className={styles.number}>
            {isCbg ? 'middle' : 'average'} {displayBgValue(data[center], bgUnits)}
          </span>
        }
        offset={{ top: 0, left: position.tooltipLeft ? -10 : 10 }}
        position={centerPosition}
        side={centerSide}
        tail={false}
      />
      <Tooltip
        content={<span className={styles.number}>{displayBgValue(data[bottom], bgUnits)}</span>}
        backgroundColor={'transparent'}
        borderColor={'transparent'}
        position={bottomPosition}
        side={'bottom'}
        tail={false}
      />
    </div>
  );
};

FocusedRangeLabels.propTypes = {
  bgUnits: PropTypes.oneOf([MGDL_UNITS, MMOLL_UNITS]).isRequired,
  dataType: PropTypes.oneOf(['cbg', 'smbg']).isRequired,
  focusedKeys: PropTypes.arrayOf(PropTypes.oneOf([
    'firstQuartile',
    'max',
    'median',
    'min',
    'ninetiethQuantile',
    'tenthQuantile',
    'thirdQuartile',
  ])),
  focusedRange: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      max: PropTypes.number.isRequired,
      mean: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
      msX: PropTypes.number.isRequired,
      msFrom: PropTypes.number.isRequired,
      msTo: PropTypes.number.isRequired,
    }).isRequired,
    position: PropTypes.shape({
      left: PropTypes.number.isRequired,
      tooltipLeft: PropTypes.bool.isRequired,
      yPositions: PropTypes.shape({
        max: PropTypes.number.isRequired,
        mean: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }),
  focusedSlice: PropTypes.shape({
    data: PropTypes.shape({
      firstQuartile: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      max: PropTypes.number.isRequired,
      median: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
      msFrom: PropTypes.number.isRequired,
      msTo: PropTypes.number.isRequired,
      msX: PropTypes.number.isRequired,
      ninetiethQuantile: PropTypes.number.isRequired,
      tenthQuantile: PropTypes.number.isRequired,
      thirdQuartile: PropTypes.number.isRequired,
    }).isRequired,
    position: PropTypes.shape({
      left: PropTypes.number.isRequired,
      tooltipLeft: PropTypes.bool.isRequired,
      yPositions: PropTypes.shape({
        firstQuartile: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        median: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        ninetiethQuantile: PropTypes.number.isRequired,
        tenthQuantile: PropTypes.number.isRequired,
        thirdQuartile: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }),
  timePrefs: PropTypes.shape({
    timezoneAware: React.PropTypes.bool.isRequired,
    timezoneName: React.PropTypes.oneOfType([React.PropTypes.string, null]),
  }).isRequired,
};

export default FocusedRangeLabels;
