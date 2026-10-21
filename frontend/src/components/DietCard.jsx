import React from "react";

function DietCard({
  meal,
  mealNumber
}) {
  if (!meal) {
    return null;
  }

  return (
    <div className="diet-card">

      <div className="diet-card-header">

        <div className="meal-number">
          {mealNumber || "01"}
        </div>

        <div>
          <span className="meal-type">
            {meal.type || "Meal"}
          </span>

          <h3>
            {meal.name}
          </h3>
        </div>

      </div>

      <div className="diet-foods">

        {meal.foods?.map((food, index) => (
          <div
            className="diet-food"
            key={index}
          >
            <span>
              {food.name}
            </span>

            <span>
              {food.quantity}
            </span>
          </div>
        ))}

      </div>

      <div className="diet-macros">

        <div>
          <span>Calories</span>
          <strong>
            {meal.calories || 0} kcal
          </strong>
        </div>

        <div>
          <span>Protein</span>
          <strong>
            {meal.protein || 0} g
          </strong>
        </div>

        <div>
          <span>Carbs</span>
          <strong>
            {meal.carbs || 0} g
          </strong>
        </div>

        <div>
          <span>Fat</span>
          <strong>
            {meal.fat || 0} g
          </strong>
        </div>

      </div>

    </div>
  );
}

export default DietCard;