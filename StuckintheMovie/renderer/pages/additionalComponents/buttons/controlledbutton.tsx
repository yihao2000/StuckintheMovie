import React from "react";
import LoadingButton from "./loadingbutton";

export class ControlledButton extends React.Component<
  {},
  { loading: boolean; finished: boolean }
> {
  constructor(props) {
    super(props);

    this.state = { loading: false, finished: false };
  }

  render() {
    const { loading, finished } = this.state;

    const setLoading = !finished && loading;

    return (
      <div>
        <LoadingButton
          loading={setLoading}
          done={finished}
          onClick={() => {
            // Clicked, so show the progress dialog
            this.setState({ loading: true });

            // In a 1.5 seconds, end the progress to show that it's done
            setTimeout(() => {
              this.setState({ finished: true });
            }, 1500);
          }}
        >
          Click Me
        </LoadingButton>
      </div>
    );
  }
}
