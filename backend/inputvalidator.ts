export default function Validate(
  kind:
    | "createAccount"
    | "signIn"
    | "startConversationInput"
    | "newMessageInput"
    | "modifyConversationInput"
    | "setTitleInput",
  data: any
) {
  function CreateAccountInput(): { errors: null | Array<string> } {
    try {
      let errs = [];
      if (!data.username) {
        errs.push("No username specified.");
      } else {
        if (data.username.length < 3) {
          errs.push("The length of the username must be greater than length 3.");
        }
        if (data.username.length > 19) {
          errs.push("The length of the username must be less than length 19.");
        }
      }
      if (!data.password) {
        errs.push("No password specified.");
      } else {
        if (data.password.length < 8) {
          errs.push("Password must be greater than length 8.");
        }
        if (data.password.length > 256) {
          errs.push("Password must be less than 256 characters.");
        }
      }
      if (!data.email) {
        errs.push("No email specified.");
      }
      if (!data.phone_number) {
        errs.push("No phone number specified.");
      }
      return errs.length > 0 ? { errors: errs } : { errors: null };
    } catch (err) {
      return { errors: [err] };
    }
  }

  function SignInInput() {
    try {
      let errs = [];
      if (!data.username) {
        errs.push("No username specified.");
      }
      if (!data.password) {
        errs.push("No password specified.");
      }
      return errs.length > 0 ? { errors: errs } : { errors: null };
    } catch (err) {
      return { errors: [err] };
    }
  }

  function StartConversationInput() {
    try {
      let errs = [];
      if (!data.members) {
        errs.push("No members specified for conversation.");
        if (!(data.members.length >= 2)) {
          errs.push("Not enough members specified for conversation.");
        } else if (!(data.members.length <= 1500)) {
          errs.push("Members in conversation must remain under 1,500.");
        }
      }
      return errs.length > 0 ? { errors: errs } : { errors: null };
    } catch (err) {
      return { errors: [err] };
    }
  }
  function NewMessageInput() {
    try {
      let errs = [];
      if (!data.text && !data.image) {
        errs.push("No content for message.");
      } else if (data.text.length > 1024) {
        errs.push("Text content is too long.");
      } else if (data.text.length < 1) {
        errs.push("No content in the text.");
      }
      if (!data.conversation_id) {
        errs.push("No conversation assigned to message.");
      }
      return errs.length > 0 ? { errors: errs } : { errors: null };
    } catch (err) {
      return { errors: [err] };
    }
  }
  function ModifyConversationInput() {
    try {
      if (data.conversation_id === null) {
        return { errors: ["No conversation provided."] };
      }
    } catch (err) {
      return { errors: [err] };
    }
    return { errors: null };
  }
  function SetTitleInput() {
    try {
      if (!data.title && data.title.length != 0) {
        return { errors: ["Title needs to be specified."] };
      }
      if (data.title.length > 0 && data.title.length < 4) {
        return { errors: ["Title is too short."] };
      }
      if (data.title.length >= 30) {
        return { errors: ["Title is too long."] };
      }
    } catch (err) {
      return { errors: [err] };
    }
    return { errors: null };
  }

  const validators = {
    createAccount: CreateAccountInput,
    signIn: SignInInput,
    startConversationInput: StartConversationInput,
    newMessageInput: NewMessageInput,
    modifyConversationInput: ModifyConversationInput,
    setTitleInput: SetTitleInput,
  };
  if (!Object.keys(validators).includes(kind)) {
    return { errors: [`"${kind}" is not a valid validation.`] };
  }
  return validators[kind]();
}
