import { StyleSheet } from 'react-native';
import { useFont, fontFamily } from '../context/FontContext';


export const colors = {
  // Base color palette (teal/turquoise)
  base50: '#EDFAFA',
  base100: '#D5F5F6',
  base200: '#AFECEF',
  base300: '#7EDCE2',
  base400: '#16BDCA',
  base500: '#0694A2',
  base600: '#047481',
  base700: '#036672',
  base800: '#05505C',
  base900: '#014451',
  
  // Semantic colors (mapped to base palette)
  primary: '#047481', // base500
  primaryLight: '#D5F5F6', // base100
  text: 'black', // base900
  textSecondary: '#05505C', // base800
  background: '#EDFAFA', // base50
  backgroundSecondary: '#AFECEF', // base200
  white: '#fff',
  border: 'lightgray', // base300
  grayBackground: '#F5F8FA',
  disabled: '#DDE5ED', 
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    textAlignVertical: 'center',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});