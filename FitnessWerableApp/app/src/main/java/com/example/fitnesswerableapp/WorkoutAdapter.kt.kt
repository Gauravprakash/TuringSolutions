package com.example.fitnesswerableapp

// WorkoutAdapter.kt
class `WorkoutAdapter.kt`(private val workouts: List<Workout>) : WearableRecyclerView.Adapter<`WorkoutAdapter.kt`.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_workout, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val workout = workouts[position]
        holder.workoutName.text = workout.name
    }

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val workoutName: TextView = itemView.findViewById(R.id.workout_name)
    }
}