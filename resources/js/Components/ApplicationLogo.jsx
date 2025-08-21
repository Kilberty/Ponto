export default function ApplicationLogo(props) {
    return (
        <img
            alt="Logo"
            src="{{ asset('logo.png') }}"
            className="w-20 h-20 object-contain"
            {...props}
        />
    );
}