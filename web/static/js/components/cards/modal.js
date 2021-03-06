import React, {PropTypes} from 'react';
import ReactGravatar      from 'react-gravatar';
import PageClick          from 'react-page-click';
import moment             from 'moment';
import Actions            from '../../actions/current_board';

export default class CardModal extends React.Component {
  _closeModal() {
    const { dispatch } = this.props;

    dispatch(Actions.resetEditCard());
  }

  _renderCommentForm() {
    const { currentUser } = this.props;

    return (
      <div className="form-wrapper">
        <form onSubmit={::this._handleCommentFormSubmit}>
          <header>
            <h4>Add comment</h4>
          </header>
          <div className="gravatar-wrapper">
            <ReactGravatar email={currentUser.email} https />
          </div>
          <div className="form-controls">
            <textarea
              ref="commentText"
              rows="5"
              placeholder="Write a comment..."
              required="true"/>
            <button type="submit">Save comment</button>
          </div>
        </form>
      </div>
    );
  }

  _handleCommentFormSubmit(e) {
    e.preventDefault();

    const { id } = this.props.card;
    const { channel, dispatch } = this.props;
    const { commentText } = this.refs;

    const comment = {
      card_id: id,
      text: commentText.value.trim(),
    };

    dispatch(Actions.createCardComment(channel, comment));

    commentText.value = '';
  }

  _renderComments(card) {
    if (card.comments.length == 0) return false;

    const comments = card.comments.map((comment) => {
      const { user } = comment;

      return (
        <div key={comment.id} className="comment">
          <div className="gravatar-wrapper">
            <ReactGravatar email={user.email} https />
          </div>
          <div className="info-wrapper">
            <h5>{user.first_name}</h5>
            <div className="text">
              {comment.text}
            </div>
            <small>{moment(comment.inserted_at).fromNow()}</small>
          </div>
        </div>
      );
    });

    return (
      <div className="comments-wrapper">
        <h4>Activity</h4>
        {comments}
      </div>
    );
  }

  _handleHeaderClick(e) {
    const { dispatch } = this.props;
    dispatch(Actions.editCard(true));
  }

  _handleCancelClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(Actions.editCard(false));
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    const { name, description } = this.refs;

    const { card } = this.props;

    card.name = name.value.trim();
    card.description = description.value.trim();

    const { channel, dispatch } = this.props;

    dispatch(Actions.updateCard(channel, card));
  }

  _renderHeader() {
    const { card, edit } = this.props;

    if (edit) {
      return (
        <header className="editing">
          <form onSubmit={::this._handleFormSubmit}>
            <input
              ref="name"
              type="text"
              placeholder="Title"
              required="true"
              defaultValue={card.name} />
            <textarea
              ref="description"
              type="text"
              placeholder="Description"
              rows="5"
              defaultValue={card.description} />
            <button type="submit">Save card</button> or <a href="#" onClick={::this._handleCancelClick}>cancel</a>
          </form>
        </header>
      );
    } else {
      return (
        <header onClick={::this._handleHeaderClick}>
          <h3>{card.name}</h3>
          <h5>Description</h5>
          <p>{card.description}</p>
        </header>
      );
    }
  }

  render() {
    const { card } = this.props;

    return (
      <div className="md-overlay">
        <div className="md-modal">
          <PageClick onClick={::this._closeModal}>
            <div className="md-content card-modal">
              {::this._renderHeader()}
              {::this._renderCommentForm()}
              {::this._renderComments(card)}
            </div>
          </PageClick>
        </div>
      </div>
    );
  }
}

CardModal.propTypes = {
};
