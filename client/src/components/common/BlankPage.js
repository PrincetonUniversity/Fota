/******************************************************************************
 * Called by: Base
 * Dependencies: ./Header
 *
 * Description: A blank page.
 *
 ******************************************************************************/

import React from 'react';
import { Text } from 'react-native';
import { Header } from './';

const BlankPage = () => (
    <Header><Text style={{ backgroundColor: '#f00' }}>Nothing here!</Text></Header>
);

export default BlankPage;
