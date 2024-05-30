// Initialize Shepherd tour
const tour = new Shepherd.Tour({
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: 'shepherd-theme-default',
    scrollTo: { behavior: 'smooth', block: 'center' }
  }
});

// Add steps to the tour
tour.addStep({
  title: 'Welcome to Bharat Voters',
  text: 'This is Digital Voting System for Digital India. Let me show you around!',
  attachTo: {
    element: '.stagname',
    on: 'bottom',
  },
  buttons: [
    {
      action() {
        return this.next();
      },
      text: 'Next',
    },
  ],
});

tour.addStep({
  title: 'Process',
  text: 'Click to know the Step by Step Procedure for Voting',
  attachTo: {
    element: '#know',
    on: 'bottom',
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back',
    },
    {
      action() {
        return this.next();
      },
      text: 'Next',
    },
  ],
});

tour.addStep({
  title: 'Checkout your profile!',
  text: 'Get Your all info at one place.',
  attachTo: {
    element: '#prof',
    on: 'top',
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back',
    },
    {
      action() {
        return this.next();
      },
      text: 'Next',
    },
  ],
});

tour.addStep({
  title: 'Confuse whome to vote? Know Your Candidates!',
  text: 'Meet the Candidates and choose your Democratic Leader !',
  attachTo: {
    element: '#meet',
    on: 'left',
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'next',
    },
    {
      action() {
        return this.next();
      },
      text: 'Next',
    },
  ],
});

tour.addStep({
  title: 'Vote here and see the live counts !',
  text: 'Input Aadhaar and Vote Your party and know who wins.',
  attachTo: {
    element: '#voten',
    on: 'left',
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back',
    },
    {
      action() {
        return this.complete();
      },
      text: 'Got it!',
    },
  ],
});

// Start the tour on page load
window.onload = () => {
  tour.start();
};

// JavaScript code for the To-Do List
