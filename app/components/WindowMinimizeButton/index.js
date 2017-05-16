// @flow
import React from 'react';
import WindowControlButton from '../WindowControlButton';
import icon from './minimize.png';

type WindowMinimizeButtonType = {
  size: string
};

export default function WindowMimimizeButton(props: WindowMinimizeButtonType) {
  return <WindowControlButton {...props} icon={icon} />;
}
