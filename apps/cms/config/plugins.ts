import type { Core } from '@strapi/strapi';

// The content types only take images, video and audio.
const allowedMediaTypes = ['image/*', 'video/*', 'audio/*'];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      // 50 MB per file (Strapi's default is 1 GB); strapi::body enforces the same.
      sizeLimit: 50 * 1024 * 1024,
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
