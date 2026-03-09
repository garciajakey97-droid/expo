import {
  Button,
  ContextMenu,
  Divider,
  DropdownMenuItem,
  Host,
  Icon,
} from '@expo/ui/jetpack-compose';
import * as React from 'react';
import { View, Text } from 'react-native';

import { Section } from '../../components/Page';

// This are random icons used for testing. Feel free to replace them with more fitting icons if needed.
const faceIcon = require('../../../assets/icons/api/Camera.png');
const profileIcon = require('../../../assets/icons/api/Contacts.png');
const favoriteIcon = require('../../../assets/icons/api/Haptic.png');
const checkIcon = require('../../../assets/icons/api/KeepAwake.png');
const homeIcon = require('../../../assets/icons/api/Location.png');
const notificationIcon = require('../../../assets/icons/api/Notification.png');
const printIcon = require('../../../assets/icons/api/Print.png');
const darkModeIcon = require('../../../assets/icons/api/ScreenOrientation.png');
const logoutIcon = require('../../../assets/icons/api/SecureStore.png');
const settingsIcon = require('../../../assets/icons/api/Sensor.png');
const starIcon = require('../../../assets/icons/api/StoreReview.png');

export default function ContextMenuScreen() {
  const [switchChecked, setSwitchChecked] = React.useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = React.useState<'Light' | 'Dark' | 'Auto'>('Auto');
  const [themeMenuExpanded, setThemeMenuExpanded] = React.useState(false);
  const [colorfulMenuExpanded, setColorfulMenuExpanded] = React.useState(false);
  const [sectionsMenuExpanded, setSectionsMenuExpanded] = React.useState(false);
  const [submenuExpanded, setSubmenuExpanded] = React.useState(false);

  React.useEffect(() => {
    if (sectionsMenuExpanded === false) {
      setSubmenuExpanded(false);
    }
  }, [sectionsMenuExpanded]);

  const themeBackgroundColor = selectedTheme === 'Dark' ? 'black' : 'white';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Section title="Theme Context Menu">
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Theme</Text>
          <Host matchContents>
            <ContextMenu
              expanded={themeMenuExpanded}
              onDismissRequest={() => setThemeMenuExpanded(false)}
              color={themeBackgroundColor}>
              <ContextMenu.Trigger>
                <Button
                  elementColors={{ containerColor: 'transparent', contentColor: 'blue' }}
                  trailingIcon="filled.ArrowDropDown"
                  onPress={() => setThemeMenuExpanded(true)}>
                  {selectedTheme}
                </Button>
              </ContextMenu.Trigger>
              <ContextMenu.Items>
                <DropdownMenuItem
                  text="Light"
                  onPress={() => {
                    setThemeMenuExpanded(false);
                    setSelectedTheme('Light');
                  }}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={starIcon} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  {selectedTheme === 'Light' && (
                    <DropdownMenuItem.TrailingIcon>
                      <Icon source={checkIcon} size={24} />
                    </DropdownMenuItem.TrailingIcon>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  text="Dark"
                  onPress={() => {
                    setThemeMenuExpanded(false);
                    setSelectedTheme('Dark');
                  }}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={faceIcon} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  {selectedTheme === 'Dark' && (
                    <DropdownMenuItem.TrailingIcon>
                      <Icon source={checkIcon} size={24} />
                    </DropdownMenuItem.TrailingIcon>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  text="Auto"
                  onPress={() => {
                    setThemeMenuExpanded(false);
                    setSelectedTheme('Auto');
                  }}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={settingsIcon} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  {selectedTheme === 'Auto' && (
                    <DropdownMenuItem.TrailingIcon>
                      <Icon source={checkIcon} size={24} />
                    </DropdownMenuItem.TrailingIcon>
                  )}
                </DropdownMenuItem>
              </ContextMenu.Items>
            </ContextMenu>
          </Host>
        </View>
      </Section>
      <Section title="Colorful Context Menu">
        <Host matchContents>
          <ContextMenu
            expanded={colorfulMenuExpanded}
            onDismissRequest={() => setColorfulMenuExpanded(false)}
            color="#e3b7ff">
            <ContextMenu.Trigger>
              <Button variant="bordered" onPress={() => setColorfulMenuExpanded(true)}>
                Show Colorful Menu
              </Button>
            </ContextMenu.Trigger>
            <ContextMenu.Items>
              <DropdownMenuItem text="Favorite" onPress={() => setColorfulMenuExpanded(false)}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={favoriteIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <DropdownMenuItem text="Star" onPress={() => setColorfulMenuExpanded(false)}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={starIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
                <DropdownMenuItem.TrailingIcon>
                  <Icon source={checkIcon} size={24} />
                </DropdownMenuItem.TrailingIcon>
              </DropdownMenuItem>
            </ContextMenu.Items>
          </ContextMenu>
        </Host>
      </Section>
      <Section title="Context Menu with Sections">
        <Host matchContents>
          <ContextMenu
            expanded={sectionsMenuExpanded}
            onDismissRequest={() => setSectionsMenuExpanded(false)}>
            <ContextMenu.Trigger>
              <Button variant="outlined" onPress={() => setSectionsMenuExpanded(true)}>
                Show Menu with Sections
              </Button>
            </ContextMenu.Trigger>
            <ContextMenu.Items>
              <DropdownMenuItem
                text="Home"
                onPress={() => {
                  setSectionsMenuExpanded(false);
                  console.log('Home pressed');
                }}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={homeIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <Divider />
              <ContextMenu
                expanded={submenuExpanded}
                onDismissRequest={() => setSubmenuExpanded(false)}>
                <ContextMenu.Trigger>
                  <DropdownMenuItem text="Submenu" onPress={() => setSubmenuExpanded(true)}>
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={printIcon} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                  </DropdownMenuItem>
                </ContextMenu.Trigger>
                <ContextMenu.Items>
                  <DropdownMenuItem
                    text="Profile Settings"
                    onPress={() => {
                      setSectionsMenuExpanded(false);
                      console.log('Profile pressed');
                    }}>
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={profileIcon} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    text="Notifications"
                    onPress={() => {
                      setSectionsMenuExpanded(false);
                      console.log('Notifications pressed');
                    }}>
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={notificationIcon} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    text={switchChecked ? 'Dark Mode: ON' : 'Dark Mode: OFF'}
                    onPress={() => {
                      setSectionsMenuExpanded(false);
                      setSwitchChecked(!switchChecked);
                    }}>
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={darkModeIcon} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                  </DropdownMenuItem>
                </ContextMenu.Items>
              </ContextMenu>
              <Divider />
              <DropdownMenuItem
                text="Logout"
                onPress={() => {
                  setSectionsMenuExpanded(false);
                  console.log('Logout pressed');
                }}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={logoutIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
            </ContextMenu.Items>
          </ContextMenu>
        </Host>
      </Section>
    </View>
  );
}

ContextMenuScreen.navigationOptions = {
  title: 'Context Menu',
};
