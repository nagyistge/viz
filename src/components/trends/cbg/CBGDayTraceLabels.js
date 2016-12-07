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

import moment from 'moment-timezone';
import React, { PropTypes } from 'react';

import Tooltip from '../../common/tooltips/Tooltip';

import { MGDL_UNITS, MMOLL_UNITS } from '../../../utils/constants';
import { displayBgValue } from '../../../utils/format';

import styles from './CBGDayTraceLabels.css';

// tooltip offsets
const TOP_OFFSET = -10;
const LEFT_OFFSET = 15;

const CBGDayTraceLabels = (props) => {
  const { focusedCbgDateMean } = props;
  if (!focusedCbgDateMean) {
    return null;
  }
  const { bgUnits } = props;
  const { data: { date, mean: dayMean }, position } = focusedCbgDateMean;
  const tooltipPosition = { left: position.left, top: position.top };

  return (
    <div>
      <Tooltip
        title={
          <span className={styles.date}>
            {moment(date, 'YYYY-MM-DD').format('dddd MMM Do')}
          </span>
        }
        content={<span className={styles.number}>{displayBgValue(dayMean, bgUnits)}</span>}
        position={tooltipPosition}
        side={position.tooltipLeft ? 'left' : 'right'}
      />
    </div>
  );
};

CBGDayTraceLabels.propTypes = {
  bgUnits: PropTypes.oneOf([MGDL_UNITS, MMOLL_UNITS]).isRequired,
  focusedCbgDateMean: PropTypes.shape({
    data: PropTypes.shape({
      date: PropTypes.string.isRequired,
      mean: PropTypes.number.isRequired,
      msX: PropTypes.number.isRequired,
    }).isRequired,
    position: PropTypes.shape({
      left: PropTypes.number.isRequired,
      tooltipLeft: PropTypes.bool.isRequired,
      top: PropTypes.number.isRequired,
    }).isRequired,
  }),
};

export default CBGDayTraceLabels;
