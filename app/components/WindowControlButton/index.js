// @folw
import React from 'react';

type WindowControlButtonType = {
  size: string,
  icon: string
};

export default function WindowControlButton(props: WindowControlButtonType) {
  const { size, icon } = props;
  const cleanProps = { ...props };
  const { style = {} } = cleanProps;
  delete cleanProps.style;
  delete cleanProps.size;
  return (
    <span
      style={{
        display: 'inline-block',
        ...style
      }}
      {...cleanProps}
    >
      <span
        style={{
          display: 'inline-block',
          backgroundImage: `url(${icon})`,
          backgroundSize: 'cover',
          float: 'left',
          width: size,
          height: size,
          cursor: 'pointer',
        }}
      />
    </span>
  );
}
