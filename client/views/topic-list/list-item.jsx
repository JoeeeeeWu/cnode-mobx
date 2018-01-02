import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line

import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import ListItemText from 'material-ui/List/ListItemText';
import Avatar from 'material-ui/Avatar';

const Primary = ({ topic }) => (
  <div>
    <span>{topic.tab}</span>
    <span>{topic.title}</span>
  </div>
);

Primary.propTypes = {
  topic: PropTypes.object.isRequired,
};

const Secondary = ({ topic }) => (
  <div>
    <span>{topic.username}</span>
    <span>
      <span>{topic.reply_count}</span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>创建时间：{topic.create_at}</span>
  </div>
);

Secondary.propTypes = {
  topic: PropTypes.object.isRequired,
};

const TopListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <ListItemAvatar>
      <Avatar src={topic.image} />
    </ListItemAvatar>
    <ListItemText
      primary={<Primary topic={topic} />}
      secondary={<Secondary topic={topic} />}
    />
  </ListItem>
);

TopListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
};

export default TopListItem;
