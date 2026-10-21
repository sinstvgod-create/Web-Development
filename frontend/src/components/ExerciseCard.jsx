import React from "react";

function ExerciseCard({
  exercise,
  onSelect,
  showProgression = true
}) {
  if (!exercise) {
    return null;
  }

  return (
    <div className="exercise-card">

      <div className="exercise-card-top">

        <div className="exercise-icon">
          {exercise.name
            ? exercise.name.charAt(0).toUpperCase()
            : "E"}
        </div>

        <div className="exercise-card-info">

          <h3>
            {exercise.name}
          </h3>

          <p>
            {exercise.muscleGroup || "Full Body"}
          </p>

        </div>

      </div>

      <div className="exercise-details">

        <div>
          <span>Sets</span>
          <strong>
            {exercise.sets || exercise.defaultSets || 3}
          </strong>
        </div>

        <div>
          <span>Reps</span>
          <strong>
            {exercise.reps || exercise.defaultReps || 10}
          </strong>
        </div>

        <div>
          <span>Equipment</span>
          <strong>
            {exercise.equipment || "Gym"}
          </strong>
        </div>

      </div>

      {showProgression && (
        <div className="exercise-progression">

          <span>
            Next Target
          </span>

          <strong>
            {exercise.nextTarget || "Progressive Overload"}
          </strong>

        </div>
      )}

      {onSelect && (
        <button
          type="button"
          className="exercise-select-btn"
          onClick={() => onSelect(exercise)}
        >
          SELECT EXERCISE
        </button>
      )}

    </div>
  );
}

export default ExerciseCard;