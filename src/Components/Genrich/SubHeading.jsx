import React from 'react';
import images from '../../constants/genrichImages';

const SubHeading = ({ title }) => (
  <div className="app__subheading">
    <p className="p__cormorant">{title}</p>
    <img src={images.spoon} alt="spoon" className="spoon__img" />
  </div>
);

export default SubHeading;
