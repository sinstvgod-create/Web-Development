import React, {
  createContext,
  useContext,
  useState
} from "react";

const ProgressionContext = createContext();

function ProgressionProvider({ children }) {
  const [nextTarget, setNextTarget] = useState(null);

  const [workoutResult, setWorkoutResult] = useState(null);

  const [failureCount, setFailureCount] = useState(0);

  const updateNextTarget = (target) => {
    setNextTarget(target);
  };

  const updateWorkoutResult = (result) => {
    setWorkoutResult(result);
  };

  const updateFailureCount = (count) => {
    setFailureCount(count);
  };

  const resetProgression = () => {
    setNextTarget(null);
    setWorkoutResult(null);
    setFailureCount(0);
  };

  return (
    <ProgressionContext.Provider
      value={{
        nextTarget,
        workoutResult,
        failureCount,
        updateNextTarget,
        updateWorkoutResult,
        updateFailureCount,
        resetProgression
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
}

function useProgression() {
  return useContext(ProgressionContext);
}

export {
  ProgressionProvider,
  useProgression
};