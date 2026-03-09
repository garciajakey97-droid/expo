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

const homeIcon = require('../../../assets/icons/api/Location.png');
const profileIcon = require('../../../assets/icons/api/Contacts.png');
const notificationIcon = require('../../../assets/icons/api/Notification.png');
const darkModeIcon = require('../../../assets/icons/api/ScreenOrientation.png');
const logoutIcon = require('../../../assets/icons/api/SecureStore.png');
const starIcon = require('../../../assets/icons/api/StoreReview.png');
const favoriteIcon = require('../../../assets/icons/api/Haptic.png');
const checkIcon = require('../../../assets/icons/api/KeepAwake.png');
const settingsIcon = require('../../../assets/icons/api/Sensor.png');
const faceIcon = require('../../../assets/icons/api/Camera.png');

export default function ContextMenuScreen() {
  const [switchChecked, setSwitchChecked] = React.useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = React.useState<'Light' | 'Dark' | 'Auto'>('Auto');

  const themeBackgroundColor = selectedTheme === 'Dark' ? 'black' : 'white';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Section title="Theme Context Menu">
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Theme</Text>
          <Host matchContents>
            <ContextMenu color={themeBackgroundColor}>
              <ContextMenu.Trigger>
                <Button
                  elementColors={{ containerColor: 'transparent', contentColor: 'blue' }}
                  trailingIcon="filled.ArrowDropDown">
                  {selectedTheme}
                </Button>
              </ContextMenu.Trigger>
              <ContextMenu.Items>
                <DropdownMenuItem text="Light" onPress={() => setSelectedTheme('Light')}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={starIcon} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  {selectedTheme === 'Light' && (
                    <DropdownMenuItem.TrailingIcon>
                      <Icon source={checkIcon} size={24} />
                    </DropdownMenuItem.TrailingIcon>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem text="Dark" onPress={() => setSelectedTheme('Dark')}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={faceIcon} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  {selectedTheme === 'Dark' && (
                    <DropdownMenuItem.TrailingIcon>
                      <Icon source={checkIcon} size={24} />
                    </DropdownMenuItem.TrailingIcon>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem text="Auto" onPress={() => setSelectedTheme('Auto')}>
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
          <ContextMenu color="#e3b7ff">
            <ContextMenu.Trigger>
              <Button variant="bordered">Show Colorful Menu</Button>
            </ContextMenu.Trigger>
            <ContextMenu.Items>
              <DropdownMenuItem text="Favorite">
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={favoriteIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <DropdownMenuItem text="Star">
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
          <ContextMenu>
            <ContextMenu.Trigger>
              <Button variant="outlined">Show Menu with Sections</Button>
            </ContextMenu.Trigger>
            <ContextMenu.Items>
              <DropdownMenuItem text="Home" onPress={() => console.log('Home pressed')}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={homeIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <Divider />
              <DropdownMenuItem
                text="Profile Settings"
                onPress={() => console.log('Profile pressed')}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={profileIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <DropdownMenuItem
                text="Notifications"
                onPress={() => console.log('Notifications pressed')}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={notificationIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <DropdownMenuItem
                text={switchChecked ? 'Dark Mode: ON' : 'Dark Mode: OFF'}
                onPress={() => setSwitchChecked(!switchChecked)}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={darkModeIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <Divider />
              <DropdownMenuItem text="Logout" onPress={() => console.log('Logout pressed')}>
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={logoutIcon} size={24} />
                </DropdownMenuItem.LeadingIcon>
              </DropdownMenuItem>
              <Divider />
              <ContextMenu>
                <ContextMenu.Trigger>
                  <DropdownMenuItem text="Submenu">
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={logoutIcon} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                  </DropdownMenuItem>
                </ContextMenu.Trigger>
                <ContextMenu.Items>
                  <DropdownMenuItem text="Logout" onPress={() => console.log('Logout pressed')}>
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={logoutIcon} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                  </DropdownMenuItem>
                </ContextMenu.Items>
              </ContextMenu>
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
