import React from 'react';
import './header.css';

export const Header = () => {
  return (
    <div className="header " >
      <img alt="lunactic acres" src="data:image/png;base64,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"/>
      <span>LUNATIC ACRES</span>
    </div>
  );
}


export default Header;