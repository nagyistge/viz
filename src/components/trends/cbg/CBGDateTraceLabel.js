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

import styles from './CBGDateTraceLabel.css';


const CBGDateTraceLabel = (props) => {
  const { focusedCbgDate } = props;
  if (!focusedCbgDate) {
    return null;
  }
  const { data: { date }, position } = focusedCbgDate;

  return (
    <div>
      <Tooltip
        title={
          <span className={styles.date}>
            {moment(date, 'YYYY-MM-DD').format('dddd MMM D')}
          </span>
        }
        borderWidth={'0'}
        position={{ left: position.left, top: position.topMargin }}
        side={'bottom'}
        tail={false}
      />
    </div>
  );
};

CBGDateTraceLabel.propTypes = {
  focusedCbgDate: PropTypes.shape({
    data: PropTypes.shape({
      date: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      msX: PropTypes.number.isRequired,
    }).isRequired,
    position: PropTypes.shape({
      left: PropTypes.number.isRequired,
      tooltipLeft: PropTypes.bool.isRequired,
      top: PropTypes.number.isRequired,
      topMargin: PropTypes.number.isRequired,
    }).isRequired,
  }),
};

export default CBGDateTraceLabel;
