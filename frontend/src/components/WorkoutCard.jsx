import React from "react";
import { Link } from "react-router-dom";

function WorkoutCard({
  day,
  title,
  description,
  exercises = [],
  duration,
  difficulty = "Intermediate"
}) {
  return (
    <div className="workout-card">

      <div className="workout-card-header">
        <div>
          <span className="workout-day">
            {day}
          </span>

          <h3>
            {title}
          </h3>

          {description && (
            <p>
              {description}
            </p>
          )}
        </div>

        <span className="workout-difficulty">
          {difficulty}
        </span>
      </div>

      <div className="workout-meta">

        {duration && (
          <span>
            ⏱ {duration}
          </span>
        )}

        <span>
          {exercises.length} Exercises
        </span>

      </div>

      <div className="workout-exercises">

        {exercises.map((exercise, index) => (
          <div
            className="workout-exercise"
            key={exercise.id || index}
          >

            <div className="exercise-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="exercise-info">
              <strong>
                {exercise.name}
              </strong>

              <span>
                {exercise.sets} Sets × {exercise.reps} Reps
              </span>
            </div>

            {exercise.weight && (
              <span className="exercise-weight">
                {exercise.weight} kg
              </span>
            )}

          </div>
        ))}

      </div>

      <Link
        to="/workout/log"
        className="workout-start-btn"
      >
        START WORKOUT →
      </Link>

    </div>
  );
}

export default WorkoutCard;