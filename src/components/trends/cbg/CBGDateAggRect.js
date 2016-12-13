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

import _ from 'lodash';
import { mean } from 'd3-array';
import cx from 'classnames';
import React, { PropTypes } from 'react';

import { classifyBgValue } from '../../../utils/bloodglucose';

import styles from './CBGDateAggRect.css';

const CBGDateAggRect = (props) => {
  const { bgBounds, dataGroupedByDate, focusedMeanDate } = props;
  const { focusedSlice: { data: { msX }, position } } = props;
  const { rectHeight, sliceRadius, xScale, yScale } = props;
  return (
    <g id="cbgMeansPerDay">
      {_.map(_.keys(dataGroupedByDate), (key) => {
        const dayData = dataGroupedByDate[key];
        const dayMean = mean(dayData, (d) => (d.value));
        const isFocused = key === focusedMeanDate;
        const rectClasses = cx({
          cbgMeanRect: true, // for the CBGSlice mouseout event handler to detect
          [styles[classifyBgValue(bgBounds, dayMean)]]: true,
          [styles.invisible]: (focusedMeanDate !== null) && isFocused,
          [styles.transparify]: (focusedMeanDate !== null) && !isFocused,
        });
        return (
          <rect
            className={rectClasses}
            x={xScale(msX) - sliceRadius}
            y={yScale(dayMean) - rectHeight / 2}
            width={2 * sliceRadius}
            height={rectHeight}
            rx={2}
            ry={2}
            key={key}
            onClick={() => {
              props.onSelectDate(focusedMeanDate);
              props.unfocusDate();
              props.unfocusSlice();
            }}
            onMouseOver={_.partial(props.focusDate, {
              date: key,
              value: dayMean,
              msX,
            }, {
              left: xScale(msX),
              tooltipLeft: msX > props.tooltipLeftThreshold,
              top: yScale(dayMean),
              topMargin: position.yPositions.topMargin,
            })}
            onMouseOut={props.unfocusDate}
          />
        );
      })}
    </g>
  );
};

CBGDateAggRect.defaultProps = {
  rectHeight: 7.5,
};

CBGDateAggRect.propTypes = {
  bgBounds: PropTypes.shape({
    veryHighThreshold: PropTypes.number.isRequired,
    targetUpperBound: PropTypes.number.isRequired,
    targetLowerBound: PropTypes.number.isRequired,
    veryLowThreshold: PropTypes.number.isRequired,
  }).isRequired,
  dataGroupedByDate: PropTypes.object.isRequired,
  focusDate: PropTypes.func.isRequired,
  focusedMeanDate: PropTypes.string,
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
        topMargin: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  onSelectDate: PropTypes.func.isRequired,
  rectHeight: PropTypes.number.isRequired,
  sliceRadius: PropTypes.number.isRequired,
  tooltipLeftThreshold: PropTypes.number.isRequired,
  unfocusDate: PropTypes.func.isRequired,
  unfocusSlice: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

export default CBGDateAggRect;
