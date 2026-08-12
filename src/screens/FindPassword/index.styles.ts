import styled from 'styled-components';
import theme from '../../styles/theme';
import DismissKeyboardView from '../../components/common/DismissKeyboadView';

export const FindPasswordContainer = styled(DismissKeyboardView)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
`;
