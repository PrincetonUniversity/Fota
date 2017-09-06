import React from 'react';
import SettingsRadioButton from '../Settings/SettingsRadioButton';
import SettingsWebView from '../Settings/SettingsWebView';
import TOS from '../../docs/TermsOfService.html';
import PP from '../../docs/PrivacyPolicy.html';

export const SettingsRadius = (props) => (
  <SettingsRadioButton
    title='Search Radius'
    name='SearchRadius'
    extraText=' mi.'
    options={['1', '3', '5', '10']}
    navigation={props.navigation}
  />
);

export const TermsOfService = (props) => (
  <SettingsWebView
    title='Terms of Service'
    source={TOS}
    navigation={props.navigation}
  />
);

export const PrivacyPolicy = (props) => (
  <SettingsWebView
    title='Privacy Policy'
    source={PP}
    navigation={props.navigation}
  />
);
