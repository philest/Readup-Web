

    if (this.props.readerState === "READER_STATE_AWAITING_START") {
      return (
        <div>
          <div className={[styles.buttonContainer].join(" ")}>
            <RectangleButton
              title="Start Recording"
              pulsatingArrow={false && true}
              disabled={this.props.disabled}
              onClick={this.props.onStartClicked}
              partiallyDisabled
              isLarge
              isGreen
            />
          </div>

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