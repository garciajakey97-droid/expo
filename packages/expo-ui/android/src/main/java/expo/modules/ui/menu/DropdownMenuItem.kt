package expo.modules.ui.menu

import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.ui.ModifierList
import expo.modules.ui.findChildSlotView
import java.io.Serializable

class ItemPressedEvent : Record, Serializable

data class DropdownMenuItemProps(
  val text: String = "",
  val enabled: Boolean = true,
  val modifiers: ModifierList = emptyList()
) : ComposeProps

@Composable
fun FunctionalComposableScope.DropdownMenuItemContent(
  props: DropdownMenuItemProps,
  onItemPressed: (ItemPressedEvent) -> Unit
) {
  val leadingSlotView = findChildSlotView(view, "leadingIcon")
  val trailingSlotView = findChildSlotView(view, "trailingIcon")

  DropdownMenuItem(
    text = { Text(props.text) },
    enabled = props.enabled,
    leadingIcon = leadingSlotView?.let {
      { with(ComposableScope()) { with(it) { Content() } } }
    },
    trailingIcon = trailingSlotView?.let {
      { with(ComposableScope()) { with(it) { Content() } } }
    },
    onClick = {
      onItemPressed(ItemPressedEvent())
    }
  )
}
