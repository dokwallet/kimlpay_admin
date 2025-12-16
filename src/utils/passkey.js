import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

export const startPasskeyRegistration = async optionsJSON => {
  try {
    // Pass the options to the authenticator and wait for a response
    return await startRegistration({ optionsJSON });
  } catch (error) {
    // Some basic error handling
    if (error.name === 'InvalidStateError') {
      throw new Error('Passkey is already registered');
    } else {
      console.error('Error in startPasskeyRegistration', error);
    }
    throw error;
  }
};

export const startPasskeyAuthentication = async optionsJSON => {
  try {
    // Pass the options to the authenticator and wait for a response
    return await startAuthentication({ optionsJSON });
  } catch (error) {
    // Some basic error handling
    console.error('Error in start authentication', error);
    throw error;
  }
};
