// import { useCallback } from 'react';
// import * as Yup from 'yup';

// // form
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useForm } from 'react-hook-form';
// // @mui
// import { LoadingButton } from '@mui/lab';
// import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import { storage } from "../../../../config-global";

// // auth
// import { useAuthContext } from '../../../../auth/useAuthContext';
// // utils
// import { fData } from '../../../../utils/formatNumber';
// // assets
// import { countries } from '../../../../assets/data';
// // components
// import FormProvider, {
//   RHFSelect,
//   RHFSwitch,
//   RHFTextField,
//   RHFUploadAvatar,
// } from '../../../../components/hook-form';
// import { useSnackbar } from '../../../../components/snackbar';
// // firebase
// import { updateUser } from '../../../../controller/adminController'; // Ensure this path is correct

// export default function AccountGeneral() {
//   const { enqueueSnackbar } = useSnackbar();

//   const { user } = useAuthContext();

//   const UpdateUserSchema = Yup.object().shape({
//     displayName: Yup.string().required('Name is required'),
//     email: Yup.string().required('Email is required').email('Email must be a valid email address'),
//     photoURL: Yup.string().required('Avatar is required').nullable(true),
//     phoneNumber: Yup.string().required('Phone number is required'),
//     country: Yup.string().required('Country is required'),
//     address: Yup.string().required('Address is required'),
//     state: Yup.string().required('State is required'),
//     city: Yup.string().required('City is required'),
//     zipCode: Yup.string().required('Zip code is required'),
//     about: Yup.string().required('About is required'),
//   });

//   const defaultValues = {
//     displayName: user?.displayName || '',
//     email: user?.email || '',
//     photoURL: user?.photoURL || null,
//     phoneNumber: user?.phoneNumber || '',
//     country: user?.country || '',
//     address: user?.address || '',
//     state: user?.state || '',
//     city: user?.city || '',
//     zipCode: user?.zipCode || '',
//     about: user?.about || '',
//     isPublic: user?.isPublic || false,
//   };

//   const methods = useForm({
//     resolver: yupResolver(UpdateUserSchema),
//     defaultValues,
//   });

//   const {
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const onSubmit = async (data) => {
//     try {
//       if (user?.uid) {
//         await updateUser(user.uid, data); // Update user data in Firestore
//         enqueueSnackbar('Update success!');
//         console.log('DATA', data);
//       } else {
//         enqueueSnackbar('User ID not found', { variant: 'error' });
//       }
//     } catch (error) {
//       console.error(error);
//       enqueueSnackbar('Update failed', { variant: 'error' });
//     }
//   };

//   const handleDrop = useCallback(
//     async (acceptedFiles) => {
//       const file = acceptedFiles[0];
  
//       try {
//         // Create a storage reference
//         const storageRef = ref(storage, `avatars/${file.name}`);
        
//         // Upload file to Firebase Storage
//         const snapshot = await uploadBytesResumable(storageRef, file);
  
//         // Get download URL
//         const downloadURL = await getDownloadURL(snapshot.ref);
  
//         // Set avatarUrl in the form to the download URL
//         setValue('photoURL', downloadURL, { shouldValidate: true });
//       } catch (error) {
//         console.error('Error uploading file:', error);
//       }
//     },
//     [setValue, ]
//   );

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
//             <RHFUploadAvatar
//               name="photoURL"
//               maxSize={3145728}
//               onDrop={handleDrop}
//               helperText={
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     mt: 2,
//                     mx: 'auto',
//                     display: 'block',
//                     textAlign: 'center',
//                     color: 'text.secondary',
//                   }}
//                 >
//                   Allowed *.jpeg, *.jpg, *.png, *.gif
//                   <br /> max size of {fData(3145728)}
//                 </Typography>
//               }
//             />

//             <RHFSwitch
//               name="isPublic"
//               labelPlacement="start"
//               label="Public Profile"
//               sx={{ mt: 5 }}
//             />
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Box
//               rowGap={3}
//               columnGap={2}
//               display="grid"
//               gridTemplateColumns={{
//                 xs: 'repeat(1, 1fr)',
//                 sm: 'repeat(2, 1fr)',
//               }}
//             >
//               <RHFTextField name="displayName" label="Name" />

//               <RHFTextField name="email" label="Email Address" />

//               <RHFTextField name="phoneNumber" label="Phone Number" />

//               <RHFTextField name="address" label="Address" />

//               <RHFSelect native name="country" label="Country" placeholder="Country">
//                 <option value="" />
//                 {countries.map((country) => (
//                   <option key={country.code} value={country.label}>
//                     {country.label}
//                   </option>
//                 ))}
//               </RHFSelect>

//               <RHFTextField name="state" label="State/Region" />

//               <RHFTextField name="city" label="City" />

//               <RHFTextField name="zipCode" label="Zip/Code" />
//             </Box>

//             <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
//               <RHFTextField name="about" multiline rows={4} label="About" />

//               <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
//                 Save Changes
//               </LoadingButton>
//             </Stack>
//           </Card>
//         </Grid>
//       </Grid>
//     </FormProvider>
//   );
// }

import { useCallback } from 'react';
import * as Yup from 'yup';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "../../../../config-global";

// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar
} from '../../../../components/hook-form';
import { useSnackbar } from '../../../../components/snackbar';
// firebase
import { updateUser } from '../../../../controller/adminController'; // Ensure this path is correct

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.string().required('Avatar is required').nullable(true),
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    about: Yup.string().required('About is required'),
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const photoURL = watch('photoURL');

  const onSubmit = async (data) => {
    try {
      if (user?.uid) {
        await updateUser(user.uid, data); // Update user data in Firestore
        enqueueSnackbar('Update success!');
        // navigate('/');
        console.log('DATA', data);
      } else {
        enqueueSnackbar('User ID not found', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Update failed', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
  
      try {
        // Create a storage reference
        const storageRef = ref(storage, `avatars/${file.name}`);
        
        // Upload file to Firebase Storage
        const snapshot = await uploadBytesResumable(storageRef, file);
  
        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Set avatarUrl in the form to the download URL
        setValue('photoURL', downloadURL, { shouldValidate: true });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Controller
              name="photoURL"
              control={methods.control}
              render={({ field }) => (
                <RHFUploadAvatar
                  {...field}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  currentPhotoURL={photoURL}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              )}
            />
            {/* <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="displayName" label="Name" />

              <RHFTextField name="email" label="Email Address" />

              <RHFTextField name="phoneNumber" label="Phone Number" />

              <RHFTextField name="address" label="Address" />

              <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />

              <RHFTextField name="city" label="City" />

              <RHFTextField name="zipCode" label="Zip/Code" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
