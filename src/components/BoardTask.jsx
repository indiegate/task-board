import React, { Component } from 'react';

export class BoardTask extends Component {
  constructor(props) {
    super(props);
  }

  _splitToWords(content) {
    return content.split(' ');
  }

  _renderSentence(words) {
    let sentence = '';
    words.map((word) => {
      if (!word.startsWith('#')) {
        sentence += word + ' ';
      }
    });
    return sentence;
  }

  _renderTags(words) {
    const tags = [];
    words.map((word) => {
      if (word.startsWith('#')) {
        tags.push(word.substring(1, word.length));
      }
    });
    return tags.map((tag) => {
      return <div className="ui mini horizontal label">{tag}</div>;
    });
  }

  render() {
    return (
      <div>
        {this._renderTags(this._splitToWords(this.props.content))}
        {this._renderSentence(this._splitToWords(this.props.content))}
      </div>
    );
  }
}

BoardTask.propTypes = {
  content: React.PropTypes.string.isRequired,
};