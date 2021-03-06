import React from 'react';
import Wirer from '../../Wirer';
import { ChromeStyle } from '../../themes/chrome';
import { NodeList, Connections } from './index'
import { themeStyles } from '../themeStyles';

export const WirerContext = React.createContext<Wirer>(null);

interface Props {
  width?: number;
  height?: number;
  gridSize?: number;
  gridColor?: string;
  backgroundColor?: string;
  onLoad?: (canvas?: Wirer) => void;
  renderNode?: () => JSX.Element;
}

export default class Container extends React.Component<Props> {
  canvas?: Wirer;

  static defaultProps = {
    width: 800,
    height: 600,
    backgroundColor: '#CCCCCC75',
    gridColor: 'grey',
    gridSize: '20',
    onLoad: null,
  }

  buildUp (ref) {
    if (!ref)
      return null;

    if (this.canvas)
      return null;

    const { width, height, gridSize, gridColor, backgroundColor } = this.props;
    const canvas = new Wirer({ width, height });
    canvas.render.loadContainer(ref);
    canvas.render.react = this;
    canvas.render.gridColor = gridColor;
    canvas.render.backgroundColor = backgroundColor;
    canvas.render.gridSize = gridSize;
    canvas.render.themeStyles = themeStyles;
    ref.wrapper = canvas;
    this.canvas = canvas;

    if (typeof(this.props.onLoad) == 'function')
      this.props.onLoad(canvas);
  }

  render () {
    const { canvas, props } = this;
    const themeStyles = canvas?.render.themeStyles;
    const linesStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }
    return (
      <WirerContext.Provider value={this.canvas}>
        <div>
          <ChromeStyle />
          <div style={themeStyles?.wirerCanvas}>
            <svg
              style={{ ...themeStyles?.svgContent, ...canvas?.render.getGridStyle() }}
              preserveAspectRatio="xMidYMid meet"
              ref={ref => this.buildUp(ref)}
            >
              {canvas && (
                <>
                  <NodeList
                    nodes={canvas.nodes}
                    renderNode={props.renderNode}
                    offset={canvas.render.offset}
                    zoom={canvas.render.zoom}
                  />
                  <Connections
                    canvas={canvas}
                    connections={canvas.render.getConnections()}
                    offset={canvas.render.offset}
                    zoom={canvas.render.zoom}
                  />
                </>
              )}
            </svg>
          </div>
        </div>
      </WirerContext.Provider>
    );
  }
}

  