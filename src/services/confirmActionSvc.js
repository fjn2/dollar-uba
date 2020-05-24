import { ActionSheetIOS, Platform } from 'react-native';
export const confirmAction = (onConfirm) => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Remove'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          onConfirm && onConfirm()
        }
      }
    );
  }
};