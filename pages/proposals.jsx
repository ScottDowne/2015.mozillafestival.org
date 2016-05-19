var React = require('react');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');
var HeroUnit = require('../components/hero-unit.jsx');
var Icon = require('react-fa');
require('whatwg-fetch');

var RealInput = React.createClass({
  render: function() {
    if (this.props.type === "textarea") {
      return (
        <textarea className={this.props.className} maxLength={this.props.maxlength} onChange={this.props.updateFunction} id={this.props.for}/>
      );
    }
    return (
      <input maxLength={this.props.maxlength} onClick={this.props.onClick || function() {}} onChange={this.props.updateFunction} id={this.props.for} type={this.props.type}/>
    );
  }
});

var InputCombo = React.createClass({
  updateFunction: function(e, other) {
    document.querySelector("#" + this.props.for + "Error").classList.remove("show");
    if (this.props.wordcount || this.props.wordcount === 0) {
      var value = e.target.value.trim();
      var wordcount = this.props.wordcount;
      if (value) {
        wordcount = this.props.wordcount - value.split(/\s+/).length;
      }
      this.setState({
        wordcount: wordcount
      });
    }
  },
  getInitialState: function() {
    if (this.props.wordcount || this.props.wordcount === 0) {
      return {
        wordcount: this.props.wordcount
      };
    } else {
      return {};
    }
  },
  render: function() {
    var hasWordcount = (this.props.wordcount || this.props.wordcount === 0);
    var inputClassName = "";
    var wordcountClassName = "word-count";
    var inputContainerClassName = "input-container";
    if (hasWordcount) {
      inputClassName = "has-wordcount";
      inputContainerClassName += " input-container-has-wordcount";
      if (this.state.wordcount < 0) {
        wordcountClassName += " negative";
      }
    }
    var wordcountElement;
    if (hasWordcount) {
      wordcountElement = (<p className={wordcountClassName}>{this.state.wordcount}</p>);
    }
    var labelElement = (
      <label id={this.props.for + "Link"} className={this.props.className} htmlFor={this.props.for}>
        {this.props.children}
      </label>
    );
    var topLabel;
    var bottomLabel;
    if (this.props.type !== "checkbox") {
      topLabel = labelElement;
    } else {
      bottomLabel = labelElement;
    }
    return (
      <div className={this.props.for + "-container input-combo " + this.props.type + "-container"}>
        {topLabel}
        <div className={inputContainerClassName}>
          {wordcountElement}
          <RealInput onClick={this.props.onClick || function() {}} className={inputClassName} maxlength={this.props.maxlength || 1650} updateFunction={this.updateFunction} for={this.props.for} type={this.props.type}/>
        </div>
        {bottomLabel}
        <div id={this.props.for + "Error"} className="error-message">{this.props.errorMessage}</div>
      </div>
    );
  }
});

var Proposals = React.createClass({
  /*otherInputClicked: function() {
    var checkbox = document.querySelector("#otherTheme");
    checkbox.checked = true;
    this.themeCheckboxClicked();
    document.querySelector("#theme-other-error-message").classList.remove("show");
  },
  otherCheckboxClicked: function() {
    var input = document.querySelector(".other-theme-input");
    input.focus();
    this.themeCheckboxClicked();
    document.querySelector("#theme-other-error-message").classList.remove("show");
  },
  themeCheckboxClicked: function() {
    document.querySelector("#theme-error-message").classList.remove("show");
  },
  onSubmit: function() {
    var self = this;
    document.querySelector("#generic-error").classList.remove("show");
    self.refs.submitButton.getDOMNode().classList.add("waiting");
    var fieldNames = "sessionName firstName surname email organization twitter otherFacilitators description agenda participants outcome".split(" ");
    var requiredFields = "sessionName firstName surname email description agenda participants outcome".split(" ");
    var fieldValues = {};
    var isError = "";

    var privacyPolicy = document.querySelector("#privacyPolicy").checked;

    for (var i = 0; i < fieldNames.length; i++) {
      fieldValues[fieldNames[i]] = document.querySelector("#" + fieldNames[i]).value;
      if (requiredFields.indexOf(fieldNames[i]) >= 0 && ( !fieldValues[fieldNames[i]] || !fieldValues[fieldNames[i]].trim() )) {
        if (!isError) {
          isError = "#" + fieldNames[i] + "Link";
        }
        if (document.querySelector("#" + fieldNames[i] + "Error")) {
          document.querySelector("#" + fieldNames[i] + "Error").classList.add("show");
        }
      } else if (!isError && document.querySelector("." + fieldNames[i] + "-container .word-count") &&
                 parseInt(document.querySelector("." + fieldNames[i] + "-container .word-count").textContent, 10) < 0) {
        isError = "#" + fieldNames[i] + "Link";
      }
    }

    var themeValues = "";
    var themeOtherError = false;
    var themes = "Advocacy,Citizenship,Data,Inclusion,Economics,Environment,Ethics and Values,Journalism,Leadership,Open Practices,Place,Privacy,Science,Sustainability,User Control,Web Literacy,Youth,Other".split(",");
    themes.forEach(function(val) {
      var dataVal = val.replace(/ /g, "");
      dataVal = dataVal[0].toLowerCase() + dataVal.slice(1);
      var theme = document.querySelector("#" + dataVal + "Theme");
      if (theme.checked) {
        if (dataVal === "other") {
          var otherValue = document.querySelector(".other-theme-input").value.trim();
          if (!otherValue) {
            themeOtherError = true;
          } else {
            themeValues += otherValue;
          }
        } else {
          themeValues += val;
        }
        themeValues += ", ";
      }
    });
    themeValues = themeValues.trim();
    // Remove last comma.
    themeValues = themeValues.substring(0, themeValues.length-1);

    if (themeOtherError) {
      document.querySelector("#theme-other-error-message").classList.add("show");
    }

    if (!themeValues) {
      if (!isError) {
        isError = "#otherTheme";
      }
      document.querySelector("#theme-error-message").classList.add("show");
    }

    if (!privacyPolicy) {
      if (!isError) {
        isError = "#privacyPolicyLink";
      }
      document.querySelector("#privacyPolicyError").classList.add("show");
    }

    if (isError) {
      self.refs.submitButton.getDOMNode().classList.remove("waiting");
      window.location.href = window.location.origin + window.location.pathname + isError;
      return;
    }

    fetch('/add-session', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "sessionName": fieldValues.sessionName,
        "firstName": fieldValues.firstName,
        "surname": fieldValues.surname,
        "email": fieldValues.email,
        "organization": fieldValues.organization,
        "twitter": fieldValues.twitter,
        "otherFacilitators": fieldValues.otherFacilitators,
        "description": fieldValues.description,
        "agenda": fieldValues.agenda,
        "participants": fieldValues.participants,
        "outcome": fieldValues.outcome,
        "theme": themeValues
      })
    }).then(function(response) {
      self.refs.submitButton.getDOMNode().classList.remove("waiting");
      if (response.ok) {
        window.location.href = "/session-add-success";
      } else {
        document.querySelector("#generic-error").classList.add("show");
        window.location.href = window.location.origin + window.location.pathname + "#submit-button";
      }
    });
  },*/
  getInitialState: function() {
    return {
      section: "one"
    };
  },
  onSpaceClicked: function(e) {
    var isExhibit = false;
    if (e.target.id === "exhibit") {
      isExhibit = true;
    }
    this.setState({
      exhibit: isExhibit
    });
  },
  onNext: function() {
    if (this.state.exhibit) {
      this.setState({
        section: "exhibit"
      });
      return;
    }
    this.setState({
      section: "desc"
    });
  },
  render: function() {
    var sectionOneClassName = "proposal-section section-1";
    var sectionExhibitClassName = "proposal-section section-exhibit";
    var sectionDescClassName = "proposal-section section-desc";
    if (this.state.section === "one") {
      sectionDescClassName += " hidden";
      sectionExhibitClassName += " hidden";
    } else if (this.state.section === "exhibit") {
      sectionOneClassName += " hidden";
      sectionDescClassName += " hidden";
    } else if (this.state.section === "desc") {
      sectionOneClassName += " hidden";
      sectionExhibitClassName += " hidden";
    }
    return (
      <div className="proposals-page">
        <Header/>
        <HeroUnit image="/assets/images/proposals.jpg"
                  image2x="/assets/images/proposals.jpg">
          <div>call for proposals</div>
          <div className="deadline">
            <span>Deadline for submission is 31st of August 2015 at 21:00 UTC</span>
          </div>
        </HeroUnit>
        <div className="content">
          <div className="proposals-form">
            <h1>Share your idea</h1>
            <p>Please fill in the fields below to propose your session. Note: once you have submitted your session, you will not be able to edit it directly.</p>

            <p>Some planning tips: we believe in peer-to-peer sessions, learning through making, open dialog and hacking in small groups. Think participation, not PowerPoint.</p>

            <p>You should expect anywhere between five and 50 participants at your session. Be prepared for a range of group sizes, abilities and ages. As a facilitator, you will frame the session goals, team up small groups and ensure participants work productively and purposefully together.</p>

            <p>We're looking forward to reviewing your submission. If you have any questions, please email <a href="mailto:festival@mozilla.org">festival@mozilla.org</a>.</p>

            <div className={sectionOneClassName}>
              <InputCombo errorMessage="Full name is required." for="fullName" type="text">
                Full Name *
              </InputCombo>
              <InputCombo errorMessage="Email is required." for="email" type="text">
                Email *
              </InputCombo>
              <InputCombo for="organization" type="text">
                Organization
              </InputCombo>
              <InputCombo for="otherFacilitators" type="text">
                Other facilitators
              </InputCombo>
              <InputCombo for="twitter" type="text">
                What's your Twitter handle?
              </InputCombo>

              <label id="">What Space are you submitting your proposal to? *</label>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="digital" type="radio">
                What i digital art?
              </InputCombo>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="localisation" type="radio">
                Localisation
              </InputCombo>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="science" type="radio">
                Science
              </InputCombo>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="journalism" type="radio">
                Journalism
              </InputCombo>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="demystify" type="radio">
                Demystify the Web
              </InputCombo>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="exhibit" type="radio">
                Moz Ex (exhibit)
              </InputCombo>
              <InputCombo onClick={this.onSpaceClicked} className="radio-input" for="cities" type="radio">
                A tale of two cities - the dilemmas of shared connected spaces.
              </InputCombo>

              <button className="button" id="next-button" ref="nextButton" onClick={this.onNext}>Next <Icon spin name="spinner"/></button>
            </div>

            <div className={sectionExhibitClassName}>
              <InputCombo errorMessage="Title is required." for="" type="text">
                Title of Piece *
              </InputCombo>
              <InputCombo errorMessage="Method is required." for="" type="text">
                Method *
              </InputCombo>
              <InputCombo errorMessage="Link is required." for="" type="text">
                Link to see your work *
              </InputCombo>

              <InputCombo wordcount="150" errorMessage="Description is required." for="" type="textarea">
                Describe your work in 150 words or less. *
              </InputCombo>

              <InputCombo errorMessage="Field is required." for="" type="text">
                What will your work allow people to learn and reflect on? *
              </InputCombo>

              <InputCombo errorMessage="Field is required." for="" type="text">
                Why do you think Mozfest is a good place to show your work? *
              </InputCombo>

              <label id="">Anything you submit must be your own original work. If your content contains other’s material (e.g. images, video, music, etc) you must have obtained the necessary permissions to use the material. Alongside the use of your work at MozFest 2016, the Digital Learning team at Tate will select artworks to feature in a pop-up show-case as part of the Tate Exchange programme. Your content will not be used for commercial purposes but we may use your content to promote our platform or project using social media, websites, and other web-platforms. Copyright in your contribution will remain with you and this permission is not exclusive, so you can continue to use the material in any way including allowing others to use it, including licensing that material to other websites. *
Please confirm you agree to these terms by ticking the box below. If you don't agree with these terms but would like to speak to a member of the team, please contact us at festival@mozilla.org</label>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Yes
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                No
              </InputCombo>

              <label id="">Is there another space you believe this exhibit could be shown within? *</label>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                What is digital art?
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Localisation
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Science
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Journalism
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Mozilla Learning
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                IOT
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                NO
              </InputCombo>


              <InputCombo errorMessage="You must agree to our privacy policy." className="checkbox-input" for="privacyPolicy" type="checkbox">
                I&lsquo;m okay with Mozilla handling my info as explained in this <a href="https://www.mozilla.org/en-US/privacy/">Privacy Policy</a>.
              </InputCombo>
              <button className="button full-width" id="submit-button" ref="submitButton" onClick={this.onSubmit}>Submit <Icon spin name="spinner"/></button>
              <div id="generic-error" className="error-message">Uh oh! There's an unknown error with your session proposal. Please try again later, or email <a href="mailto:festival@mozilla.org ">festival@mozilla.org</a> for help.</div>
            </div>

            <div className={sectionDescClassName}>

              <InputCombo wordcount="150" errorMessage="Field is required." for="" type="textarea">
                Describe what your session or activity will allow people to make, learn or do in 150 words or less. *
              </InputCombo>

              <InputCombo wordcount="150" errorMessage="Field is required." for="" type="textarea">
                Describe how you see that working in 150 words or less. *
              </InputCombo>

              <label id="">MozFest accepts a lot of different formats for submissions please choose a format below that most likely fits your proposal *</label>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Demo - 15 minute showcase of completed work or product
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Learning Lab - 60 minute session where the audience both learns and interacts with others
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Fireside chat - 45 minute talk with time for questions and answers
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Design sprint- 2-3 hour workshop dedicated hands-on making, hacking and producing 'a thing'
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Other: <input onClick={function() {}} className="" type="text"/>
              </InputCombo>

              <InputCombo errorMessage="Field is required." for="" type="text">
                How will you accommodate varying numbers of participants in your session? Tell us what you'll do with 3 participants. 15? 25?
              </InputCombo>

              <InputCombo errorMessage="Field is required." for="" type="text">
                How will you accommodate varying numbers of participants in your session? Tell us what you'll do with 3 participants. 15? 25?
              </InputCombo>
              <InputCombo wordcount="150" errorMessage="Outcome is required." for="outcome" type="textarea">
                What do you see as outcomes after the festival? How will you and your participants take the learning and activities forward? In 150 words or less. *
              </InputCombo>

              <InputCombo for="" type="text">
                Are you comfortable leading your session in another language? If yes, please outline below
              </InputCombo>

              <label id="">MozFest offers limited places for travel sponsorship (travel stipend) covering flights and accommodation over the festival weekend. Please choose an option below if you wish to be considered for a travel stipend *</label>
              <InputCombo onClick={function() {}} className="checkbox-input" for="" type="checkbox">
                I can only attend MozFest if I receive a travel stipend covering my travel and accommodation
              </InputCombo>
              <InputCombo onClick={function() {}} className="checkbox-input" for="" type="checkbox">
                I would like to considered for a travel stipend but my attendance is not soley relient on receiving one
              </InputCombo>
              <InputCombo onClick={function() {}} className="checkbox-input" for="" type="checkbox">
                I do not require a travel stipend
              </InputCombo>

              <label id="">If your session is not accepted in your preferred Space is there another space you would like your session to be considered within? *</label>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                What is digital art?
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Localisation
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Science
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Journalism
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                Mozilla Learning
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                IOT
              </InputCombo>
              <InputCombo onClick={function() {}} className="radio-input" for="" type="radio">
                NO
              </InputCombo>

              <InputCombo errorMessage="You must agree to our privacy policy." className="checkbox-input" for="privacyPolicy" type="checkbox">
                I&lsquo;m okay with Mozilla handling my info as explained in this <a href="https://www.mozilla.org/en-US/privacy/">Privacy Policy</a>.
              </InputCombo>
              <button className="button full-width" id="submit-button" ref="submitButton" onClick={this.onSubmit}>Submit <Icon spin name="spinner"/></button>
              <div id="generic-error" className="error-message">Uh oh! There's an unknown error with your session proposal. Please try again later, or email <a href="mailto:festival@mozilla.org ">festival@mozilla.org</a> for help.</div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = Proposals;
