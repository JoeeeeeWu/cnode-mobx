import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import {
  inject,
  observer,
} from 'mobx-react';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';

import UserIcon from 'material-ui-icons/AccountCircle'

import Container from '../layout/container';
import userStyles from './styles/user-style';

