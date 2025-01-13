import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.support.wear.widget.SwipeDismissFrameLayout
import android.widget.TextView
import androidx.wear.widget.BoxInsetLayout

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Create a BoxInsetLayout
        val layout = BoxInsetLayout(this).apply {
            layoutParams = BoxInsetLayout.LayoutParams(
                BoxInsetLayout.LayoutParams.MATCH_PARENT,
                BoxInsetLayout.LayoutParams.MATCH_PARENT
            )
        }

        // Create a SwipeDismissFrameLayout
        val swipeLayout = SwipeDismissFrameLayout(this).apply {
            layoutParams = SwipeDismissFrameLayout.LayoutParams(
                SwipeDismissFrameLayout.LayoutParams.MATCH_PARENT,
                SwipeDismissFrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        // Create a TextView to place inside the swipe layout
        val textView = TextView(this).apply {
            text = "Swipe to dismiss"
            textSize = 20f
        }

        // Add the TextView to the SwipeDismissFrameLayout
        swipeLayout.addView(textView)

        // Set up the swipe gesture listener
        swipeLayout.addCallback(object : SwipeDismissFrameLayout.Callback() {
            override fun onDismissed(layout: SwipeDismissFrameLayout?) {
                // Handle swipe gesture (dismiss action)
                // You can add any action here, like navigating away or updating UI
                finish()  // Example: Close the activity on swipe dismiss
            }
        })

        // Add the SwipeDismissFrameLayout to the BoxInsetLayout
        layout.addView(swipeLayout)

        // Set the BoxInsetLayout as the content view
        setContentView(layout)
    }
}
