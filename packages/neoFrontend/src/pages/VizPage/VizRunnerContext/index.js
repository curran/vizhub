import React, { createContext, useContext, useRef, useEffect } from 'react';
import { VizPageDataContext } from '../VizPageDataContext';
import { defaultVizHeight, vizWidth } from '../../../constants';
import { theme } from '../../../theme';
import { Z_BELOW, Z_WAY_ABOVE } from '../../../styles';
import { useListener } from '../useListener';

// The number of milliseconds to transition when
// moving the iframe whenever the mode changes.
const transitionDuration = 500;

const srcDoc = `<style>body { background-color: pink; }</style>`;
export const VizRunnerContext = createContext();

// Yes, this will be lying around all the time, doing no harm.
// This is a singleton on the page. There will ever only be one.
const iFrame = document.createElement('iframe');

iFrame.setAttribute('srcDoc', srcDoc);
iFrame.setAttribute('width', vizWidth);

iFrame.style.position = 'fixed';
iFrame.style.border = 0;
iFrame.style.top = `0px`;
iFrame.style.left = `0px`;
iFrame.style['transform-origin'] = '0 0';
iFrame.style['z-index'] = Z_BELOW;
iFrame.style['background-color'] = '#ffffff';
iFrame.style['box-shadow'] = theme.shadowLight;
iFrame.style['transition-property'] = 'transform';

iFrame.style['transition-timing-function'] = 'cubic-bezier(.28,.66,.15,1)';

let mode;
let timeoutId;

// 'mode' here means the context in which the viz content is being viewed.
// For example, it could be 'viewer' if it's shown in the viz viewer section,
// it could be 'full' if it's shown in full screen mode,
// or it could be 'mini' if it's shown in the mini view atop the code editor.
const setVizRunnerMode = newMode => {
  const modeChanged = mode !== newMode;
  mode = newMode;

  // console.log('\nVizRunnerContext');
  // console.log('newMode = ' + newMode);
  // console.log('mode = ' + mode);

  // If mode transitions to hide, don't animate.
  if (newMode === 'hide') {
    iFrame.style.visibility = 'hidden';
    return;
  }

  // If mode transitions from hide, don't animate.
  if (mode === 'hide') {
    iFrame.style.visibility = 'visible';
    return;
  }

  if (modeChanged) {
    // Make sure viz content is above everything else while transitioning.
    iFrame.style['z-index'] = Z_WAY_ABOVE;

    // Set the transition duration before setting properties, so they animate.
    iFrame.style['transition-duration'] = transitionDuration + 'ms';

    // Clear previous timeout, in case the mode changes multiple times
    // within the transitionDuration time window.
    clearTimeout(timeoutId);

    // Wait for the transition to finish.
    timeoutId = setTimeout(() => {
      // Pop the content back under other things,
      // where it should be normally.
      iFrame.style['z-index'] = Z_BELOW;

      // Set this to zero so future updates happen instantly
      iFrame.style['transition-duration'] = '0ms';
    }, transitionDuration);
  }
};

const onVizModeChange = event => setVizRunnerMode(event.detail);

// Move the iframe to the new (x, y, scale).
const setVizRunnerTransform = ({ x, y, scale, mode }) => {
  iFrame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

  // iFrame.style.transform = `scale(${scale})`;
  // iFrame.style.top = `${y}px`;
  // iFrame.style.left = `${x}px`;
};

export const VizRunnerProvider = ({ children }) => {
  const { visualization } = useContext(VizPageDataContext);
  const vizHeight = visualization.info.height || defaultVizHeight;
  const ref = useRef();

  const contextValue = { setVizRunnerTransform };

  useEffect(() => {
    iFrame.setAttribute('height', vizHeight);
  }, [vizHeight]);

  useEffect(() => {
    const div = ref.current;
    div.appendChild(iFrame);
    return () => {
      iFrame.srcDoc = '';
      div.removeChild(iFrame);
    };
  }, [ref]);

  useListener('vizModeChange', onVizModeChange);

  return (
    <div ref={ref}>
      <VizRunnerContext.Provider value={contextValue}>
        {children}
      </VizRunnerContext.Provider>
    </div>
  );
};
