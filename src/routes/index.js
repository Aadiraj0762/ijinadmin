import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import RoleBasedGuard from '../auth/RoleBasedGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
import MainLayout from '../layouts/main';
import SimpleLayout from '../layouts/simple';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  AboutPage,
  AbstractConferenceCreate,
  AbstractConferenceEdit,
  AbstractConferenceList,
  AbstractConfrenceDetails,
  AbstractJournalCreate,
  AbstractJournalDetails
  //
  ,








































  AbstractJournalEditPage,


  AbstractjournalList,
  //
  BlankPage,
  BlogNewPostPage,
  BlogPostPage,
  // Dashboard: Blog
  BlogPostsPage,
  CalendarPage,
  // Dashboard: App
  ChatPage,
  ComingSoonPage,
  //
  ComponentsOverviewPage,
  ConferenceCreatePage,
  ConferenceDetails,
  ConferenceEditPage,
  ConferenceListPage,
  Contact,
  //
  DemoAnimatePage,
  DemoCarouselsPage,
  DemoChartsPage,
  DemoCopyToClipboardPage,
  DemoEditorPage,
  DemoFormValidationPage,
  DemoImagePage,
  DemoLabelPage,
  DemoLightboxPage,
  DemoMapPage,
  DemoMarkdownPage,
  DemoMegaMenuPage,
  DemoMultiLanguagePage,
  DemoNavigationBarPage,
  DemoOrganizationalChartPage,
  DemoScrollbarPage,
  DemoSnackbarPage,
  DemoTextMaxLinePage,
  DemoUploadPage,
  EcommerceProductCreatePage,
  EcommerceProductDetailsPage,
  EcommerceProductEditPage,
  EcommerceProductListPage,
  FaqsPage,
  // Dashboard: FileManager
  FileManagerPage,
  FoundationColorsPage,
  FoundationGridPage,
  FoundationIconsPage,
  FoundationShadowsPage,
  FoundationTypographyPage,
  GeneralAnalyticsPage,
  // Dashboard: General
  GeneralAppPage,
  GeneralBankingPage,
  GeneralBookingPage,
  GeneralEcommercePage,
  GeneralFilePage,
  IjinCreatePage,
  IJINDetails,
  IJINEdit
  //
  ,














  IjinList,
  InvoiceCreatePage,
  InvoiceDetailsPage,
  InvoiceEditPage,
  // Dashboard: Invoice
  InvoiceListPage,
  KanbanPage,
  // Auth
  LoginPage,
  MailPage,
  MaintenancePage,
  //
  MUIAccordionPage,
  MUIAlertPage,
  MUIAutocompletePage,
  MUIAvatarPage,
  MUIBadgePage,
  MUIBreadcrumbsPage,
  MUIButtonsPage,
  MUICheckboxPage,
  MUIChipPage,
  MUIDataGridPage,
  MUIDialogPage,
  MUIListPage,
  MUIMenuPage,
  MUIPaginationPage,
  MUIPickersPage,
  MUIPopoverPage,
  MUIProgressPage,
  MUIRadioButtonsPage,
  MUIRatingPage,
  MUISliderPage,
  MUIStepperPage,
  MUISwitchPage,
  MUITablePage,
  MUITabsPage,
  MUITextFieldPage,
  MUITimelinePage,
  MUITooltipPage,
  MUITransferListPage,
  MUITreesViewPage,
  NewPasswordPage,
  Page403,
  Page404,
  //
  Page500,
  PaymentPage,
  PermissionDeniedPage,
  PricingPage,
  RegisterPage,
  ResetPasswordPage,
  ThesisCreatePage,
  ThesisDetails,
  ThesisEdit,
  ThesisListPage,
  UserAccountPage,
  UserCreatePage,
  UserEditPage,
  // Dashboard: User
  UserListPage,
  UserViewPage,
  VerifyCodePage
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { element: <LoginPage />, index: true },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'ecommerce', element: <GeneralEcommercePage /> },
        { path: 'analytics', element: <GeneralAnalyticsPage /> },
        { path: 'banking', element: <GeneralBankingPage /> },
        { path: 'booking', element: <GeneralBookingPage /> },
        { path: 'file', element: <GeneralFilePage /> },
        {
          // path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/journal/list" replace />, index: true },
            { path: '/dashboard/journal/:id', element: <EcommerceProductDetailsPage /> },
            { path: '/dashboard/journal/list', element: <EcommerceProductListPage /> },
            { path: '/dashboard/journal/new', element: <EcommerceProductCreatePage /> },
            { path: '/dashboard/journal/:id/edit', element: <EcommerceProductEditPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'list', element: <UserListPage /> },
            {
              path: 'new', element: (
                <RoleBasedGuard roles={['admin']}>
                  <UserCreatePage />
                </RoleBasedGuard>
              )
            },
            {
              path: 'edit/:id', element: (
                <RoleBasedGuard roles={['admin']}>
                  <UserEditPage />
                </RoleBasedGuard>
              )
            },
            { path: 'account', element: <UserAccountPage /> },
            { path: 'view/:id', element: <UserViewPage /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceListPage /> },
            { path: ':id', element: <InvoiceDetailsPage /> },
            { path: ':id/edit', element: <InvoiceEditPage /> },
            { path: 'new', element: <InvoiceCreatePage /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPostsPage /> },
            { path: 'post/:title', element: <BlogPostPage /> },
            { path: 'new', element: <BlogNewPostPage /> },
          ],
        },
        { path: 'files-manager', element: <FileManagerPage /> },
        { path: 'conference/new', element: <ConferenceCreatePage /> },
        { path: '/dashboard/conference/:id', element: <ConferenceDetails /> },
        { path: '/dashboard/conference/list', element: <ConferenceListPage /> },
        { path: '/dashboard/conference/:id/edit', element: <ConferenceEditPage /> },
        { path: 'abstractjournal/new', element: <AbstractJournalCreate /> },
        { path: 'Abstractconference/new', element: <AbstractConferenceCreate /> },
        { path: '/dashboard/thesis/:id/edit', element: <ThesisEdit /> },
        { path: '/dashboard/thesis/new', element: <ThesisCreatePage /> },
        { path: '/dashboard/thesis-archieve/', element: <ThesisListPage /> },
        { path: '/dashboard/thesis/:volume', element: <ThesisDetails /> },
        // { path: '/search-results', element: <SearchResultsPage /> },
        { path: '/dashboard/ijin/new', element: <IjinCreatePage /> },
        { path: '/dashboard/ijin/list', element: <IjinList /> },
        { path: '/dashboard/ijin/:id/edit', element: <IJINEdit /> },
        { path: '/dashboard/ijin/:id/', element: <IJINDetails /> },

        { path: '/dashboard/abstractjournal/', element: <AbstractjournalList /> },
        { path: '/dashboard/abstractconference/', element: <AbstractConferenceList /> },
        { path: '/dashboard/abstract/:id', element: <AbstractJournalDetails /> },
        { path: '/dashboard/abstract/:id/edit', element: <AbstractJournalEditPage /> },

        { path: '/dashboard/abstractconference/:id', element: <AbstractConfrenceDetails /> },
        { path: '/dashboard/abstractconference/:id/edit', element: <AbstractConferenceEdit /> },

        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <MailPage /> },
            { path: 'label/:customLabel/:mailId', element: <MailPage /> },
            { path: ':systemLabel', element: <MailPage /> },
            { path: ':systemLabel/:mailId', element: <MailPage /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <ChatPage />, index: true },
            { path: 'new', element: <ChatPage /> },
            { path: ':conversationKey', element: <ChatPage /> },
          ],
        },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'kanban', element: <KanbanPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        // { element: <HomePage />, index: true },
        { path: 'about-us', element: <AboutPage /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <FaqsPage /> },

        // Demo Components
        {
          path: 'components',
          children: [
            { element: <ComponentsOverviewPage />, index: true },
            {
              path: 'foundation',
              children: [
                { element: <Navigate to="/components/foundation/colors" replace />, index: true },
                { path: 'colors', element: <FoundationColorsPage /> },
                { path: 'typography', element: <FoundationTypographyPage /> },
                { path: 'shadows', element: <FoundationShadowsPage /> },
                { path: 'grid', element: <FoundationGridPage /> },
                { path: 'icons', element: <FoundationIconsPage /> },
              ],
            },
            {
              path: 'mui',
              children: [
                { element: <Navigate to="/components/mui/accordion" replace />, index: true },
                { path: 'accordion', element: <MUIAccordionPage /> },
                { path: 'alert', element: <MUIAlertPage /> },
                { path: 'autocomplete', element: <MUIAutocompletePage /> },
                { path: 'avatar', element: <MUIAvatarPage /> },
                { path: 'badge', element: <MUIBadgePage /> },
                { path: 'breadcrumbs', element: <MUIBreadcrumbsPage /> },
                { path: 'buttons', element: <MUIButtonsPage /> },
                { path: 'checkbox', element: <MUICheckboxPage /> },
                { path: 'chip', element: <MUIChipPage /> },
                { path: 'data-grid', element: <MUIDataGridPage /> },
                { path: 'dialog', element: <MUIDialogPage /> },
                { path: 'list', element: <MUIListPage /> },
                { path: 'menu', element: <MUIMenuPage /> },
                { path: 'pagination', element: <MUIPaginationPage /> },
                { path: 'pickers', element: <MUIPickersPage /> },
                { path: 'popover', element: <MUIPopoverPage /> },
                { path: 'progress', element: <MUIProgressPage /> },
                { path: 'radio-button', element: <MUIRadioButtonsPage /> },
                { path: 'rating', element: <MUIRatingPage /> },
                { path: 'slider', element: <MUISliderPage /> },
                { path: 'stepper', element: <MUIStepperPage /> },
                { path: 'switch', element: <MUISwitchPage /> },
                { path: 'table', element: <MUITablePage /> },
                { path: 'tabs', element: <MUITabsPage /> },
                { path: 'textfield', element: <MUITextFieldPage /> },
                { path: 'timeline', element: <MUITimelinePage /> },
                { path: 'tooltip', element: <MUITooltipPage /> },
                { path: 'transfer-list', element: <MUITransferListPage /> },
                { path: 'tree-view', element: <MUITreesViewPage /> },
              ],
            },
            {
              path: 'extra',
              children: [
                { element: <Navigate to="/components/extra/animate" replace />, index: true },
                { path: 'animate', element: <DemoAnimatePage /> },
                { path: 'carousel', element: <DemoCarouselsPage /> },
                { path: 'chart', element: <DemoChartsPage /> },
                { path: 'copy-to-clipboard', element: <DemoCopyToClipboardPage /> },
                { path: 'editor', element: <DemoEditorPage /> },
                { path: 'form-validation', element: <DemoFormValidationPage /> },
                { path: 'image', element: <DemoImagePage /> },
                { path: 'label', element: <DemoLabelPage /> },
                { path: 'lightbox', element: <DemoLightboxPage /> },
                { path: 'map', element: <DemoMapPage /> },
                { path: 'mega-menu', element: <DemoMegaMenuPage /> },
                { path: 'multi-language', element: <DemoMultiLanguagePage /> },
                { path: 'navigation-bar', element: <DemoNavigationBarPage /> },
                { path: 'organization-chart', element: <DemoOrganizationalChartPage /> },
                { path: 'scroll', element: <DemoScrollbarPage /> },
                { path: 'snackbar', element: <DemoSnackbarPage /> },
                { path: 'text-max-line', element: <DemoTextMaxLinePage /> },
                { path: 'upload', element: <DemoUploadPage /> },
                { path: 'markdown', element: <DemoMarkdownPage /> },
              ],
            },
          ],
        },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: 'pricing', element: <PricingPage /> },
        { path: 'payment', element: <PaymentPage /> },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { element: <Navigate to="/auth/login" replace />, index: true }, // Redirect root to login
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
