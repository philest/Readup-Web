// @flow

import React from "react";
import styles from "./styles.css";

type props = {
  title: string,
  subtitle: string,
  style: {}
};

function BookInfoHeader({ title = "", subtitle = "", style = {} }: props) {
  return (
    <div className={styles.bookInfoHeaderContainer} style={style}>
      <div className={styles.bookInfoHeaderContainerTitle}>{title}</div>
    </div>
  );
}

export default BookInfoHeader;
