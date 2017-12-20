import PropTypes from "prop-types";
import React from "react";
import RectangleButton from "../RectangleButton";
import BookInfoHeader from "../BookInfoHeader";
import css from "./styles.css";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import questionCSS from "../../../ReportsInterface/components/Metric/styles.css";

import ProgressBarWithStages from "../ProgressBarWithStages";

export default class NavigationBar extends React.Component {
  static propTypes = {
    studentName: PropTypes.string,
    onPauseClicked: PropTypes.func,
    onExitClicked: PropTypes.func,

    // cover related stuff
    isCoverPage: PropTypes.bool,
    isWarmup: PropTypes.bool,
    showPauseButton: PropTypes.bool,
    showBookInfo: PropTypes.bool,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
    inComp: PropTypes.bool,
    onReport: PropTypes.bool,
    onGrading: PropTypes.bool,
    onReader: PropTypes.bool,
    white: PropTypes.bool,
    beforeStudentDemo: PropTypes.bool,
    onPreviewClicked: PropTypes.func,
    onSaveClicked: PropTypes.func,
    brand: PropTypes.string,
    showChecklistModal: PropTypes.func,
    hideMenuItems: PropTypes.bool,

    progressBar: PropTypes.bool,
    currentSection: PropTypes.string,
    format: PropTypes.string
  };

  static defaultProps = {
    showPauseButton: true,
    isCoverPage: false,
    showBookInfo: false,
    onReport: false,
    onGrading: false,
    onReader: true,
    white: false,
    beforeStudentDemo: false,
    hideMenuItems: false,
    isWarmup: false,
    progressBar: false
  };

  renderButton = () => {
    return (
      <Button
        className={[
          this.state.atBottom ? css.tryButton : css.tryButtonMuted
        ].join(" ")}
        bsStyle={"default"}
        onClick={this.onTryButtonClicked}
      >
        <span className={css.tryButtonText}> Try student demo </span>
        <i
          className={[
            "fa",
            "fa-chevron-right",
            this.state.atBottom ? css.pulsatingArrow : "",
            css.delay
          ].join(" ")}
          style={{ marginLeft: 7 }}
          aria-hidden={"true"}
        />
      </Button>
    );
  };

  renderPreviewButton = () => {
    return (
      <Button
        className={[css.tryButton].join(" ")}
        bsStyle={"default"}
        onClick={this.props.onPreviewClicked}
      >
        <span className={css.tryButtonText}> Preview report </span>
        <i
          className={[
            "fa",
            "fa-chevron-right",
            css.pulsatingArrow,
            css.delay
          ].join(" ")}
          style={{ marginLeft: 7 }}
          aria-hidden={"true"}
        />
      </Button>
    );
  };

  componentDidMount() {
    if (this.props.beforeStudentDemo) {
      setTimeout(() => {
        this.setState({ atBottom: true });
      }, 25000);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onTryButtonClicked = () => {
    window.location.href = `/${this.props.brand.toLowerCase()}`;
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = {
      name: this.props.name,
      atBottom: false
    };
  }

  render() {
    let onRightIconClick;
    let rightIconLabel;
    let rightIconButton;

    if (this.props.onReport) {
      onRightIconClick = this.props.onReplayClicked;
      rightIconButton = "fa fa-repeat";
      rightIconLabel = "Retry demo";
    } else if (this.props.onGrading) {
      onRightIconClick = this.props.showChecklistModal;
      rightIconButton = "fa fa-paper-plane";
      rightIconLabel = "Send to user";
    } else {
      onRightIconClick = this.props.onExitClicked;
      rightIconButton = "fa fa-sign-out";
      rightIconLabel = "Exit";
    }

    let navClass = null;

    if (this.props.onReport || this.props.onGrading) {
      navClass = css.reportNav;
    }

    let barColorClass = css.barNavy;
    let textColorClass = css.textWhite;

    if (this.props.white) {
      barColorClass = css.barWhite;
      textColorClass = css.textNavy;
    }

    const popoverClickRootClose = (
      <Popover
        className={questionCSS.sharePopover}
        id="popover-trigger-click-root-close"
      >
        <a href={window.location.href}>
          <strong>
            {window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname}
          </strong>
        </a>
        <br />
        Copy and paste this link to share this screen with{" "}
        <span className={css.recipient}>students</span>,{" "}
        <span className={css.recipient}>parents</span>, and{" "}
        <span className={css.recipient}>administrators</span>.
      </Popover>
    );

    return (
      <div className={[navClass, css.navContainer, barColorClass].join(" ")}>
        <div className={css.subContainer}>
          <span
            className={[css.brandText, textColorClass].join(" ")}
            onClick={this.props.onExitClicked}
          >
            ReadUp
          </span>
        </div>

        {false &&
          this.props.showPauseButton && (
            <div className={css.subContainer}>
              <div
                className={[css.centerDisplayContainer, css.headerTabBlue].join(
                  " "
                )}
              >
                <RectangleButton
                  title={"Pause Recording"}
                  id="navigation-button"
                  onClick={this.props.onPauseClicked}
                />
              </div>
            </div>
          )}

        {this.props.progressBar && (
          <span className={css.centerLabel}>
            {this.props.isWarmup ? "Practice Mode" : "Full Book"}
          </span>
        )}

        {this.props.progressBar && (
          <ProgressBarWithStages
            currentSection={this.props.currentSection}
            format={this.props.format}
          />
        )}

        {this.props.showBookInfo && (
          <div className={css.subContainer}>
            <div
              className={[css.centerDisplayContainer, css.headerTabBlue].join(
                " "
              )}
            >
              <BookInfoHeader
                title={this.props.bookTitle}
                subtitle={"by " + this.props.bookAuthor}
              />
            </div>
          </div>
        )}

        <div className={css.subContainer}>
          <div
            className={[css.rightDisplayContainer, textColorClass].join(" ")}
          >
            {this.props.beforeStudentDemo &&
              !this.props.hideMenuItems &&
              this.renderButton()}

            {this.props.onReport && (
              <OverlayTrigger
                trigger="click"
                rootClose
                placement="bottom"
                overlay={popoverClickRootClose}
              >
                <span
                  className={this.props.beforeStudentDemo ? css.lastNavElt : ""}
                >
                  <span className={css.shareLabel}>Send to others</span>
                  <i
                    className={[
                      css.logoutIcon,
                      "fa fa-paper-plane",
                      css.shareIcon
                    ].join(" ")}
                  />
                </span>
              </OverlayTrigger>
            )}

            {this.props.onGrading &&
              !this.props.hideMenuItems && (
                <span>
                  <span
                    onClick={this.props.onSaveClicked}
                    className={css.userNameLabel}
                    style={{
                      marginRight: 20,
                      fontWeight: 800,
                      fontSize: 16,
                      cursor: "pointer"
                    }}
                  >
                    Save
                    <i
                      style={{ marginLeft: 6, fontSize: 11 }}
                      className={["fa fa-bookmark"].join(" ")}
                    />
                  </span>

                  {this.renderPreviewButton()}
                </span>
              )}
            {!this.props.beforeStudentDemo &&
              !this.props.hideMenuItems && (
                <div className={css.rightMostAction}>
                  <span className={css.userNameLabel}>
                    {this.props.studentName}
                  </span>
                  <span className={css.logoutButton} onClick={onRightIconClick}>
                    <a className={[css.logoutLabel, textColorClass].join(" ")}>
                      {rightIconLabel}
                    </a>
                    <i
                      className={[css.logoutIcon, rightIconButton].join(" ")}
                    />
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}
