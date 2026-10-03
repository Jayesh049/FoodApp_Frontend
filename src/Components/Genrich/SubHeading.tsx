import React from 'react';
import spoon from '../../assets/genrich/spoon.svg';

const SubHeading = ({ title }: any) => (
  <div className="app__subheading">
    <p className="p__cormorant">{title}</p>
    <img src={spoon} alt="spoon" className="spoon__img" />
  </div>
);

export default SubHeading;
