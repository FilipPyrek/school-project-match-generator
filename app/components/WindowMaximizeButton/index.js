// @flow
import React from 'react';
import WindowControlButton from '../WindowControlButton';
import icon from './maximize.png';

type WindowMaximizeButtonType = {
  size: string
};

export default function WindowMaximizeButton(props: WindowMaximizeButtonType) {
  return <WindowControlButton {...props} icon={icon} />;
}
