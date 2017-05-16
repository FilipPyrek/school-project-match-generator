// @flow
import React from 'react';
import WindowControlButton from '../WindowControlButton';
import icon from './close.png';

type WindowCloseButtonType = {
  size: string
};

export default function WindowCloseButton(props: WindowCloseButtonType) {
  return <WindowControlButton {...props} icon={icon} />;
}
