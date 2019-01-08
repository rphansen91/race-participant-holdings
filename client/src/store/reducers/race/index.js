import { connect } from "react-redux";
import { contractInterface } from "../../../web3";
import { createAction, createReducer } from "redux-delta";
import { eventChannel, END } from 'redux-saga'
import { take, takeEvery, put, call, all, select, fork } from "redux-saga/effects";
import { displayErrorSaga, displaySuccessSaga } from "../snackbar";
import { delay } from "redux-saga";
import address from "./address";
import abi from "./abi";

const setRaceLoading = createAction("SET_RACE_LOADING");
const setEstimatedStartTime = createAction("SET_ESTIMATED_START_TIME");
const setIsStarted = createAction("SET_IS_STARTED");
const setIsEnded = createAction("SET_IS_ENDED");
const setCheckpointCount = createAction("SET_CHECKPOINT_COUNT");
const setCheckpoints = createAction("SET_CHECKPOINTS");
const setParticipantCount = createAction("SET_PARTICIPANT_COUNT");
const setParticipants = createAction("SET_PARTICIPANTS");
const setOwner = createAction("SET_OWNER");
const setName = createAction("SET_NAME");
const setDescription = createAction("SET_DESCRIPTION");
const setWinner = createAction("SET_WINNER");
const setRadius = createAction("SET_RADIUS");
const setAnte = createAction("SET_ANTE");
const setAccounts = createAction("SET_ACCOUNTS");
const joinRace = createAction("JOIN_RACE");
const joinRaceError = createAction("JOIN_RACE_ERROR");
const addCheckpoint = createAction("ADD_CHECKPOINT");
const addCheckpointError = createAction("ADD_CHECKPOINT_ERROR");
const updateContractError = createAction("UPDATE_CONTRACT_ERROR");
const addedCheckpoint = createAction("ADDED_CHECKPOINT");
const addedParticipant = createAction("ADDED_PARTICIPANT");
const pastEvent = createAction("PAST_EVENT");
const checkpointCleared = createAction("CHECKPOINT_CLEARED");
const raceStarted = createAction("RACE_STARTED");
const raceEnded = createAction("RACE_ENDED");

export const race = createReducer({}, [
    setRaceLoading.case((_, loading) => ({ loading })),
    setEstimatedStartTime.case((_, estimated_start_time) => ({ estimated_start_time })),
    setIsStarted.case((_, is_started) => ({ is_started })),
    setIsEnded.case((_, is_ended) => ({ is_ended })),
    setCheckpointCount.case((_, checkpoint_count) => ({ checkpoint_count })),
    setCheckpoints.case((_, checkpoints) => ({ checkpoints })),
    setParticipantCount.case((_, participant_count) => ({ participant_count })),
    setParticipants.case((_, participants) => ({ participants })),
    setName.case((_, name) => ({ name })),
    setDescription.case((_, description) => ({ description })),
    setOwner.case((_, owner) => ({ owner })),
    setWinner.case((_, winner) => ({ winner })),
    setRadius.case((_, radius) => ({ radius })),
    setAnte.case((_, ante) => ({ ante })),
    setAccounts.case((_, accounts) => ({ accounts }))
]);

export const withRace = connect(
    ({ race }) => ({ race }),
    { setAnte, addCheckpoint, joinRace, setName, setDescription, setEstimatedStartTime, setAnte }
);

function* addCheckpointSaga (web3, contract, { payload }) {
    const from = yield select(({ race }) => race.accounts && race.accounts[0]);
    const checkpoint_count = yield select(({ race }) => race.checkpoint_count) || 1;
    const loc = `${payload.lat || 0},${payload.lng || 0}`;
    try {
        if (!from) throw new Error("No accounts found please login to MetaMask");
        yield call(contract.methods.addCheckpoint(loc).send, { from });
        yield call(delay, 1000);
        const checkpoints = yield all(
            Array(Number(checkpoint_count + 1)).fill(null).map((_, i) => 
                call(contract.methods.checkpoints(i).call))
        );
        yield put(setCheckpointCount(Number(checkpoint_count)));
        yield put(setCheckpoints(checkpoints));
    } catch (e) {
        yield put(addCheckpointError(e.message));
    }
}

function* joinRaceSaga (web3, contract, { payload }) {
    try {
        const from = yield select(({ race }) => race.accounts && race.accounts[0]);
        if (!from) throw new Error("No accounts found please login to MetaMask");
        yield call(contract.methods.joinRace().send, { from, value: payload });
        yield call(delay, 1000);
    } catch (e) {
        yield put(joinRaceError(e.message));
    }
}

function* updateContractSaga (web3, contract, method, { payload }) {
    try {
        const from = yield select(({ race }) => race.accounts && race.accounts[0]);
        if (!from) throw new Error("No accounts found please login to MetaMask");
        yield call(contract.methods[method](payload).send, { from });
    } catch (e) {
        yield put(updateContractError(e.message));
    }
}

function watchEvent(from) {
    return eventChannel(emitter => {
        const ev = from((err, data) => {
            data && emitter(data);
        });
        return () => {};
    })
}

function* watchChannel(channel, to) {
    while (true) {
      const payload = yield take(channel)
      yield put(to(payload))
    }
}

export default function* raceSaga (web3) {
    yield put(setRaceLoading(true));
    const contract = contractInterface(web3, address, abi);
    const checkpoint_count = yield call(contract.methods.checkpoint_count().call);
    const participant_count = yield call(contract.methods.participant_count().call);
    const [
        checkpoints,
        participants,
        name,
        description,
        estimated_start_time,
        is_started,
        is_ended,
        owner,
        winner,
        radius,
        ante,
        accounts
    ] = yield all([
        yield all(
            Array(Number(checkpoint_count)).fill(null).map((_, i) => 
                call(contract.methods.checkpoints(i).call))
        ),
        yield all(
            Array(Number(participant_count)).fill(null).map((_, i) => 
                call(contract.methods.participants(i).call))
        ),
        call(contract.methods.name().call),
        call(contract.methods.description().call),
        call(contract.methods.estimated_start_time().call),
        call(contract.methods.is_started().call),
        call(contract.methods.is_ended().call),
        call(contract.methods.owner().call),
        call(contract.methods.winner().call),
        call(contract.methods.radius().call),
        call(contract.methods.ante().call),
        call(web3.eth.getAccounts),
    ]);
    yield put(setCheckpointCount(Number(checkpoint_count)));
    yield put(setParticipantCount(Number(participant_count)));
    yield put(setName(name));
    yield put(setDescription(description));
    yield put(setEstimatedStartTime(estimated_start_time));
    yield put(setCheckpoints(checkpoints));
    yield put(setParticipants(participants));
    yield put(setIsStarted(is_started));
    yield put(setIsEnded(is_ended));
    yield put(setOwner(owner));
    yield put(setWinner(winner));
    yield put(setRadius(Number(radius)));
    yield put(setAnte(Number(ante)));
    yield put(setAccounts(accounts));
    yield put(setRaceLoading(false));
    
    yield takeEvery(addCheckpoint.type, addCheckpointSaga, web3, contract);
    yield takeEvery(joinRace.type, joinRaceSaga, web3, contract);
    yield takeEvery(setName.type, updateContractSaga, web3, contract, "setName");
    yield takeEvery(setDescription.type, updateContractSaga, web3, contract, "setDescription");
    yield takeEvery(setEstimatedStartTime.type, updateContractSaga, web3, contract, "setEstimatedStartTime");
    yield takeEvery(addCheckpointError.type, displayErrorSaga);
    yield takeEvery(joinRaceError.type, displayErrorSaga);
    yield takeEvery(updateContractError.type, displayErrorSaga);
    yield takeEvery(addedCheckpoint.type, displaySuccessSaga, { payload: "Added checkpoint" });
    yield takeEvery(addedParticipant.type, displaySuccessSaga, { payload: "Added participant" });
    yield takeEvery(checkpointCleared.type, displaySuccessSaga, { payload: "Checkpoint cleared" });

    const pastEventsChannel = yield call(watchEvent, contract.getPastEvents.bind(contract, "allEvents", { fromBlock: 0 }));
    const addedCheckpointChannel = yield call(watchEvent, contract.events.addedCheckpoint);
    const addedParticipantChannel = yield call(watchEvent, contract.events.addedParticipant);
    const raceStartedChannel = yield call(watchEvent, contract.events.checkpointCleared);
    const checkpointClearedChannel = yield call(watchEvent, contract.events.checkpointCleared);
    const raceEndedChannel = yield call(watchEvent, contract.events.checkpointCleared);

    yield all([
        watchChannel(pastEventsChannel, pastEvent),
        watchChannel(addedCheckpointChannel, addedCheckpoint),
        watchChannel(addedParticipantChannel, addedParticipant),
        watchChannel(raceStartedChannel, raceStarted),
        watchChannel(checkpointClearedChannel, checkpointCleared),
        watchChannel(raceEndedChannel, raceEnded),
    ])
}