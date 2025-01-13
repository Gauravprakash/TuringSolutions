import android.os.Bundle
import android.support.wear.widget.BoxInsetLayout
import android.widget.TextView
import android.app.Activity

class HeartRateActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Create a BoxInsetLayout
        val layout = BoxInsetLayout(this)

        // Define the layout parameters
        val layoutParams = BoxInsetLayout.LayoutParams(
            BoxInsetLayout.LayoutParams.MATCH_PARENT,
            BoxInsetLayout.LayoutParams.MATCH_PARENT
        )

        // Set the layout parameters
        layout.layoutParams = layoutParams

        // Create a TextView to display the heart rate
        val heartRateTextView = TextView(this)

        // Define the layout parameters for the TextView
        val heartRateLayoutParams = BoxInsetLayout.LayoutParams(
            BoxInsetLayout.LayoutParams.WRAP_CONTENT,
            BoxInsetLayout.LayoutParams.WRAP_CONTENT
        )

        // Set the layout parameters for the TextView
        heartRateTextView.layoutParams = heartRateLayoutParams

        // Add the TextView to the layout
        layout.addView(heartRateTextView)

        // Set the content view of the activity
        setContentView(layout)
    }
}
