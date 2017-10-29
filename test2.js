if (this.props.readerState === "READER_STATE_TALKING_ABOUT_STOP_BUTTON") {
  return (
    <div className={[styles.buttonContainer].join(" ")}>
      <RectangleButton
        title="Stop Recording"
        pulsatingArrow={false && true}
        disabled={this.props.disabled}
        partiallyDisabled
        isLarge
        isRed
      />

      <div
        className={
          this.props.isWideBook
            ? [
                wideContainerClass,
                styles.disabledLargeWideBookpageContainer
              ].join(" ")
            : styles.bookpageContainer
        }
      >
        <BookCover imageURL={this.props.coverImageURL} />;
      </div>
    </div>
  );
}
