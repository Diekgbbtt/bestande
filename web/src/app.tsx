import React from 'react';
import {hydrate, render} from 'react-dom';
import Modal from 'react-modal';
import {App} from './components/app';

const rootElement = document.getElementById('app');
Modal.setAppElement('#app');
// @ts-expect-error
(window.serverRendered ? hydrate : render)(<App />, rootElement);
