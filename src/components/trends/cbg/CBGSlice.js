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

import styles from './CBGSlice.css';

const CBGSlice = (props) => {
  const { datum } = props;
  if (!datum) {
    return null;
  }
  const { aSliceIsFocused, isFocused } = props;
  const { medianRadius, sliceCapRadius, xScale, yPositions } = props;
  const { focusSlice, unfocusSlice: unfocus } = props;
  const { cbg100Enabled: hundred,
    cbg80Enabled: eighty,
    cbg50Enabled: fifty,
    cbgMedianEnabled: median } = props.displayFlags;

  function getClass(category) {
    if (aSliceIsFocused) {
      return isFocused ? styles[category] : styles[`${category}Backgrounded`];
    }
    return styles[category];
  }

  const focusMedian = () => {
    const left = xScale(datum.msX);
    focusSlice(datum, {
      left,
      tooltipLeft: datum.msX > props.tooltipLeftThreshold,
      topOptions: yPositions,
    }, ['median']);
  };

  function renderRoundedRect(category, y1Accessor, y2Accessor) {
    const left = xScale(datum.msX);
    const focus = () => {
      focusSlice(datum, {
        left,
        tooltipLeft: datum.msX > props.tooltipLeftThreshold,
        topOptions: yPositions,
      }, [y1Accessor, y2Accessor]);
    };
    return (
      <rect
        className={getClass(category)}
        key={`${category}-${datum.id}`}
        id={`${category}-${datum.id}`}
        onMouseOver={focus}
        onMouseOut={unfocus}
        x={left - sliceCapRadius}
        width={2 * sliceCapRadius}
        y={yPositions[y2Accessor]}
        height={yPositions[y1Accessor] - yPositions[y2Accessor]}
        rx={sliceCapRadius}
        ry={sliceCapRadius}
      />
    );
  }

  return (
    <g id={`cbgSlice-${datum.id}`}>
      {[
        hundred && renderRoundedRect('rangeSlice', 'min', 'max'),
        eighty && renderRoundedRect('outerSlice', 'tenthQuantile', 'ninetiethQuantile'),
        fifty && renderRoundedRect('quartileSlice', 'firstQuartile', 'thirdQuartile'),
        median && <circle
          className={getClass('cbgMedian')}
          key={`individualMedian-${datum.id}`}
          id={`individualMedian-${datum.id}`}
          onMouseOver={focusMedian}
          onMouseOut={unfocus}
          cx={xScale(datum.msX)}
          cy={yPositions.median}
          r={medianRadius}
        />,
      ]}
    </g>
  );
};

CBGSlice.defaultProps = {
  medianRadius: 7,
  sliceCapRadius: 9,
};

CBGSlice.propTypes = {
  aSliceIsFocused: PropTypes.bool.isRequired,
  // if there's a gap in data, a `datum` may not exist, so not required
  datum: PropTypes.shape({
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
  }),
  displayFlags: PropTypes.shape({
    cbg100Enabled: PropTypes.bool.isRequired,
    cbg80Enabled: PropTypes.bool.isRequired,
    cbg50Enabled: PropTypes.bool.isRequired,
    cbgMedianEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  focusSlice: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  medianRadius: PropTypes.number.isRequired,
  sliceCapRadius: PropTypes.number.isRequired,
  tooltipLeftThreshold: PropTypes.number.isRequired,
  unfocusSlice: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yPositions: PropTypes.shape({
    min: PropTypes.number.isRequired,
    tenthQuantile: PropTypes.number.isRequired,
    firstQuartile: PropTypes.number.isRequired,
    median: PropTypes.number.isRequired,
    thirdQuartile: PropTypes.number.isRequired,
    ninetiethQuantile: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
};

export default CBGSlice;
