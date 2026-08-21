import styled from 'styled-components';
import theme from '../../../styles/theme';
import DismissKeyboardView from '../../../components/common/DismissKeyboadView';

export const Container = styled(DismissKeyboardView)`
  background-color: ${theme.color['gray/grayBG']};
  flex: 1;
  position: relative;
`;
