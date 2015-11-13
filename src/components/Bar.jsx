import React from 'react';
import PureComponent from './PureComponent';
import intToRGB from '../utils/colors-helper';

class Bar extends PureComponent {
  constructor(props) {
    super(props);
  }

  _renderStoryItems() {
    return this.props.stories.map((story, idx) => {
      return (
        <div className="item" key={idx}>
          <content>
            <a className="ui small inverted label"
               style={{backgroundColor: `rgb(${intToRGB(story.color)})`}}>{story.id}</a>
            <p>{story.title}</p>
          </content>
        </div>);
    });
  }

  render() {
    console.log(this.props.stories);
    if (!this.props.stories) {
      return <h1>no stories</h1>;
    }

    return (<div className="ui vertical inverted menu fixed top" style={{height: '100%'}}>
      <div className="item">
        <h4>Stories</h4>
        <div className="ui inverted relaxed divided selection list">
          {this._renderStoryItems()}
        </div>
      </div>
    </div>);
  }
}

Bar.propTypes = {
  stories: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};

export default Bar;
