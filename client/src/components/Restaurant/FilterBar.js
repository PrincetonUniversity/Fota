import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import FilterMeasurer from './FilterMeasurer';
import { FilterDisplay } from '../common';

class FilterBar extends Component {
  constructor(props) {
    super(props);

    this.state = { numberToShow: -1 };
    this.filterTotalWidth = 0;
    this.lastFilterIndex = -1;
    this.filterLengths = [];
    this.numFiltersChecked = 0;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.filters !== this.props.filters) {
      this.filterLengths.length = newProps.filters.length;
      this.filterLengths.fill(0);
    }
  }

  calculateNumberToRender() {
    let totalFilterLength = 0;
    const numberToShow = this.filterLengths.reduce((sum, filterLength) => {
      totalFilterLength += filterLength;
      if (totalFilterLength < Dimensions.get('window').width - 70) {
        return sum + 1;
      }
      return sum;
    }, 0);
    this.setState({ numberToShow });
  }

  render() {
    if (!this.props.filters) {
      return <View />;
    }
    if (this.state.numberToShow < 0) {
      return (
        <ScrollView
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          horizontal
        >
          {this.props.filters.map((filterName, index) =>
            <FilterMeasurer
              key={index}
              index={index}
              text={filterName.title}
              addWidth={width => {
                this.filterLengths[index] = width;
                this.numFiltersChecked += 1;
                if (this.numFiltersChecked === this.props.filters.length) {
                  this.calculateNumberToRender();
                }
              }}
              size={14}
            />
          )}
        </ScrollView>
      );
    }
    return (
      <ScrollView
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        horizontal
      >
        {this.props.filters.map((filterName, index) => {
          if (index < this.state.numberToShow) {
            return (
              <FilterDisplay
                key={index}
                index={index}
                text={filterName.title}
                color='white'
                size={14}
              />
            );
          }
          return <View key={index} />;
        })}
      </ScrollView>
    );
  }
}

export default FilterBar;
