export default class Magic {
    static setStateWithPromise(that, state) {
        return new Promise((resolve) => {
            that.setState(state, () => resolve());
        });
    }
}